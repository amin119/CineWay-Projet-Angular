import { Component, input, output, effect, signal, inject, DestroyRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ScreeningService, Screening, ScreeningCreate } from '../../../../services/screening.service';
import { AdminCinemaService } from '../../../../services/admin-cinema.service';
import { MoviesApi } from '../../../../services/movies-api';
import { Cinema } from '../../../../models/cinema.model';
import { MovieModel } from '../../../../models/movie.model';
import { combineLatest, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface Room {
  id: number;
  name: string;
  capacity: number;
  cinema_id: number;
}

@Component({
  selector: 'app-add-edit-showtime-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-edit-showtime-form.html',
})
export class AddEditShowtimeFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly screeningService = inject(ScreeningService);
  private readonly cinemaService = inject(AdminCinemaService);
  private readonly movieService = inject(MoviesApi);
  private readonly destroyRef = inject(DestroyRef);

  showtime = input<Screening | null>(null);
  isEditMode = input<boolean>(false);
  
  save = output<void>();
  cancel = output<void>();

  cinemas = signal<Cinema[]>([]);
  rooms = signal<Room[]>([]);
  movies = signal<MovieModel[]>([]);
  loadingRooms = signal(false);
  saving = signal(false);
  error = signal<string | null>(null);
  selectionSummary = signal<{ movieId: number | null; roomId: number | null; date: string | null }>(
    { movieId: null, roomId: null, date: null }
  );

  showtimeForm: FormGroup = this.fb.group({
    cinema_id: ['', Validators.required],
    room_id: ['', Validators.required],
    movie_id: ['', Validators.required],
    screening_date: ['', Validators.required],
    screening_time: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
  });

  constructor() {
    this.loadCinemas();
    this.loadMovies();

    // Track combined selection of movie, room, and date using combineLatest for richer validation/UX.
    combineLatest([
      this.showtimeForm.get('movie_id')!.valueChanges.pipe(startWith(this.showtimeForm.value.movie_id)),
      this.showtimeForm.get('room_id')!.valueChanges.pipe(startWith(this.showtimeForm.value.room_id)),
      this.showtimeForm.get('screening_date')!.valueChanges.pipe(startWith(this.showtimeForm.value.screening_date)),
    ]).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(([movieId, roomId, date]) => {
      this.selectionSummary.set({
        movieId: movieId ? +movieId : null,
        roomId: roomId ? +roomId : null,
        date: date || null,
      });
    });

    effect(() => {
      const showtime = this.showtime();
      if (showtime && this.isEditMode()) {
        const screeningDate = new Date(showtime.screening_time);
        const dateStr = screeningDate.toISOString().split('T')[0];
        const timeStr = screeningDate.toTimeString().slice(0, 5);

        this.showtimeForm.patchValue({
          cinema_id: showtime.room?.cinema_id || '',
          room_id: showtime.room_id,
          movie_id: showtime.movie_id,
          screening_date: dateStr,
          screening_time: timeStr,
          price: showtime.price,
        });

        if (showtime.room?.cinema_id) {
          this.onCinemaChange();
        }
      }
    });
  }

  loadCinemas(): void {
    this.cinemaService.getCinemas().subscribe({
      next: (cinemas) => this.cinemas.set(cinemas),
      error: (err) => console.error('Failed to load cinemas:', err),
    });
  }

  loadMovies(): void {
    this.movieService.getMovies().subscribe({
      next: (movies: MovieModel[]) => this.movies.set(movies),
      error: (err: any) => console.error('Failed to load movies:', err),
    });
  }

  onCinemaChange(): void {
    const cinemaId = this.showtimeForm.value.cinema_id;
    if (!cinemaId) {
      this.rooms.set([]);
      this.showtimeForm.patchValue({ room_id: '' });
      return;
    }

    this.loadingRooms.set(true);
    this.cinemaService.getCinemaRooms(+cinemaId).subscribe({
      next: (rooms) => {
        this.rooms.set(rooms);
        this.loadingRooms.set(false);
      },
      error: (err) => {
        console.error('Failed to load rooms:', err);
        this.loadingRooms.set(false);
        this.error.set('Failed to load rooms for this cinema');
      },
    });
  }

  onSubmit(): void {
    if (this.showtimeForm.invalid) return;

    const formValue = this.showtimeForm.value;
    const screeningDateTime = new Date(`${formValue.screening_date}T${formValue.screening_time}`);

    const screeningData: ScreeningCreate = {
      movie_id: +formValue.movie_id,
      room_id: +formValue.room_id,
      screening_time: screeningDateTime.toISOString(),
      price: +formValue.price,
    };

    this.saving.set(true);
    this.error.set(null);

    const request = this.isEditMode() && this.showtime()
      ? this.screeningService.updateScreening(this.showtime()!.id, screeningData)
      : this.screeningService.createScreening(screeningData);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.save.emit();
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err.error?.detail || 'Failed to save showtime. Please try again.');
      },
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
