import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MovieModel } from '../../../../models/movie.model';
import { MoviesApi } from '../../../../services/movies-api';

@Component({
  selector: 'app-add-edit-movie-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-edit-movie-page.html',
  styleUrls: ['./add-edit-movie-page.css'],
})
export class AddEditMoviePageComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private moviesApi = inject(MoviesApi);
  private destroyRef = inject(DestroyRef);

  isEditMode = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);
  movieId = signal<number | null>(null);

  form!: FormGroup;

  genreOptions = [
    'Action',
    'Comedy',
    'Drama',
    'Horror',
    'Sci-Fi',
    'Romance',
    'Thriller',
    'Animation',
    'Adventure',
    'Fantasy',
  ];

  ngOnInit() {
    this.initializeForm();
    this.checkEditMode();
  }

  private initializeForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      release_date: ['', Validators.required],
      duration_minutes: ['', [Validators.required, Validators.min(1)]],
      genre: ['', Validators.required],
      rating: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
      cast: ['', Validators.required],
      director: ['', Validators.required],
      writers: [''],
      producers: [''],
      country: ['', Validators.required],
      language: ['', Validators.required],
      budget: [''],
      poster_url: [''],
    });
  }

  private checkEditMode() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode.set(true);
      this.movieId.set(parseInt(id, 10));
      this.loadMovie(parseInt(id, 10));
    }
  }

  private loadMovie(id: number) {
    this.loading.set(true);
    this.moviesApi.getMovieById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (movie) => {
          this.form.patchValue(movie);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to load movie');
          this.loading.set(false);
          console.error(err);
        },
      });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      return;
    }

    this.loading.set(true);
    const movieData = this.form.value;

    const request$ = this.isEditMode()
      ? this.moviesApi.updateMovie(this.movieId()!, movieData)
      : this.moviesApi.createMovie(movieData);

    request$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigate(['/admin/movies']);
        },
        error: (err) => {
          this.error.set('Failed to save movie');
          this.loading.set(false);
          console.error(err);
        },
      });
  }

  onCancel() {
    this.router.navigate(['/admin/movies']);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) return `${fieldName} is required`;
    if (control.errors['minlength']) return `${fieldName} must be at least ${control.errors['minlength'].requiredLength} characters`;
    if (control.errors['min']) return `${fieldName} must be at least ${control.errors['min'].min}`;
    if (control.errors['max']) return `${fieldName} must not exceed ${control.errors['max'].max}`;

    return 'Invalid input';
  }
}
