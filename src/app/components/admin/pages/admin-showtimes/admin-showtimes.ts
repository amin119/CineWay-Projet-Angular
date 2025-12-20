import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ScreeningService, Screening } from '../../../../services/screening.service';
import { AdminCinemaService } from '../../../../services/admin-cinema.service';
import { MoviesApi } from '../../../../services/movies-api';
import { MovieModel } from '../../../../models/movie.model';
import { Cinema } from '../../../../models/cinema.model';
import { TableComponent, TableHeader } from '../../components/table/table';
import { TableRowComponent } from '../../components/table-row/table-row';
import { TableActionsComponent } from '../../components/table-actions/table-actions';
import { PaginationComponent } from '../../components/pagination/pagination';
import { PrimaryButtonComponent } from '../../components/primary-button/primary-button';
import { FilterDropdownComponent } from '../../components/filter-dropdown/filter-dropdown';
import { AddEditShowtimeFormComponent } from '../../components/add-edit-showtime-form/add-edit-showtime-form';

@Component({
  selector: 'app-admin-showtimes',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    TableRowComponent,
    TableActionsComponent,
    PaginationComponent,
    PrimaryButtonComponent,
    FilterDropdownComponent,
    AddEditShowtimeFormComponent,
  ],
  templateUrl: './admin-showtimes.html',
  styleUrl: './admin-showtimes.css',
})
export class AdminShowtimesComponent implements OnInit {
  private readonly screeningService = inject(ScreeningService);
  private readonly cinemaService = inject(AdminCinemaService);
  private readonly movieService = inject(MoviesApi);
  private readonly route = inject(ActivatedRoute);

  headers: TableHeader[] = [
    { label: 'Date & Time' },
    { label: 'Movie' },
    { label: 'Screen' },
    { label: 'Price' },
    { label: 'Actions' },
  ];

  showtimes = signal<Screening[]>([]);
  cinemas = signal<Cinema[]>([]);
  movies = signal<MovieModel[]>([]);
  
  cinemaFilter = signal<string>('');
  movieFilter = signal<string>('');
  dateFilter = signal<string>('');
  
  loading = signal(false);
  error = signal<string | null>(null);
  
  showModal = signal(false);
  isEditMode = signal(false);
  editingShowtime = signal<Screening | null>(null);

  page = signal(1);
  itemsPerPage = 10;

  ngOnInit(): void {
    this.loadCinemas();
    this.loadMovies();
    
    this.route.queryParams.subscribe(params => {
      if (params['cinemaId']) {
        this.cinemaFilter.set(params['cinemaId']);
      }
      this.loadShowtimes();
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

  loadShowtimes(): void {
    this.loading.set(true);
    this.error.set(null);

    const params: any = {};
    if (this.cinemaFilter()) params.cinema_id = +this.cinemaFilter();
    if (this.movieFilter()) params.movie_id = +this.movieFilter();
    if (this.dateFilter()) params.date = this.dateFilter();

    this.screeningService.getScreenings(params).subscribe({
      next: (showtimes) => {
        this.showtimes.set(showtimes);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.detail || 'Failed to load showtimes');
        this.loading.set(false);
      },
    });
  }

  cinemaDropdownOptions = computed(() => [
    { value: '', label: 'All Cinemas' },
    ...this.cinemas().map(c => ({ value: c.id.toString(), label: c.name }))
  ]);

  movieDropdownOptions = computed(() => [
    { value: '', label: 'All Movies' },
    ...this.movies().map(m => ({ value: m.id.toString(), label: m.title }))
  ]);

  filteredShowtimes = computed(() => this.showtimes());

  totalPages = computed(() => Math.ceil(this.filteredShowtimes().length / this.itemsPerPage));

  paginatedShowtimes = computed(() => {
    const start = (this.page() - 1) * this.itemsPerPage;
    return this.filteredShowtimes().slice(start, start + this.itemsPerPage);
  });

  startIndex = computed(() => {
    if (this.filteredShowtimes().length === 0) return 0;
    return (this.page() - 1) * this.itemsPerPage + 1;
  });

  endIndex = computed(() => {
    const end = this.page() * this.itemsPerPage;
    return Math.min(end, this.filteredShowtimes().length);
  });

  updateCinemaFilter(value: string): void {
    this.cinemaFilter.set(value);
    this.page.set(1);
  }

  updateMovieFilter(value: string): void {
    this.movieFilter.set(value);
    this.page.set(1);
  }

  updateDateFilter(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.dateFilter.set(target.value);
    this.page.set(1);
  }

  applyFilters(): void {
    this.loadShowtimes();
  }

  onAddShowtime(): void {
    this.editingShowtime.set(null);
    this.isEditMode.set(false);
    this.showModal.set(true);
  }

  onEdit(showtime: Screening): void {
    this.editingShowtime.set(showtime);
    this.isEditMode.set(true);
    this.showModal.set(true);
  }

  onDelete(showtime: Screening): void {
    if (!confirm(`Are you sure you want to delete this showtime for "${showtime.movie?.title}"?`)) {
      return;
    }

    this.screeningService.deleteScreening(showtime.id).subscribe({
      next: () => {
        this.loadShowtimes();
      },
      error: (err) => {
        alert(err.error?.detail || 'Failed to delete showtime');
      },
    });
  }

  onFormSave(): void {
    this.showModal.set(false);
    this.loadShowtimes();
  }

  onFormCancel(): void {
    this.showModal.set(false);
  }

  previousPage(): void {
    if (this.page() > 1) {
      this.page.update(p => p - 1);
    }
  }

  nextPage(): void {
    if (this.page() < this.totalPages()) {
      this.page.update(p => p + 1);
    }
  }
}
