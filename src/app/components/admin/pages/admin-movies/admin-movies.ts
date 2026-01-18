import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AdminDataTableComponent, TableColumn } from '../../components/admin-data-table/admin-data-table';
import { SearchInputComponent } from '../../components/search-input/search-input';
import { FilterDropdownComponent } from '../../components/filter-dropdown/filter-dropdown';
import { PaginationComponent } from '../../components/pagination/pagination';
import { PrimaryButtonComponent } from '../../components/primary-button/primary-button';
import { MoviesApi } from '../../../../services/movies-api';
import { MovieModel } from '../../../../models/movie.model';

type MovieStatus = 'Published' | 'Upcoming' | 'Draft' | 'Archived';

@Component({
  selector: 'app-admin-movies',
  imports: [
    CommonModule,
    AdminDataTableComponent,
    SearchInputComponent,
    FilterDropdownComponent,
    PaginationComponent,
    PrimaryButtonComponent,
  ],
  templateUrl: './admin-movies.html',
  styleUrls: ['./admin-movies.css'],
})
export class AdminMoviesComponent implements OnInit {
  private router = inject(Router);
  private moviesApi = inject(MoviesApi);
  private destroyRef = inject(DestroyRef);
  private readonly pageSize = 10;

  // State
  readonly movies = signal<MovieModel[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly searchTerm = signal('');
  readonly statusFilter = signal<MovieStatus | 'all'>('all');
  readonly page = signal(1);

  // Computed
  readonly statusOptions: (MovieStatus | 'all')[] = ['all', 'Published', 'Upcoming', 'Draft', 'Archived'];

  readonly statusDropdownOptions = computed(() =>
    this.statusOptions.map((s) => ({ value: s, label: s === 'all' ? 'All statuses' : s }))
  );

  readonly filteredMovies = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const status = this.statusFilter();

    return this.movies().filter((movie) => {
      const matchesTerm =
        !term ||
        movie.title.toLowerCase().includes(term) ||
        movie.description.toLowerCase().includes(term);
      const matchesStatus = status === 'all' || this.getMovieStatus(movie) === status;
      return matchesTerm && matchesStatus;
    });
  });

  readonly totalPages = computed(() => {
    const total = this.filteredMovies().length;
    return total === 0 ? 1 : Math.ceil(total / this.pageSize);
  });

  readonly paginatedMovies = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.filteredMovies().slice(start, start + this.pageSize);
  });

  readonly startIndex = computed(() => {
    const hasItems = this.filteredMovies().length > 0;
    return hasItems ? (this.page() - 1) * this.pageSize + 1 : 0;
  });

  readonly endIndex = computed(() => {
    const total = this.filteredMovies().length;
    return total === 0 ? 0 : Math.min(this.page() * this.pageSize, total);
  });

  readonly tableColumns: TableColumn[] = [
    { key: 'title', label: 'Movie Title', align: 'left' },
    { key: 'release_date', label: 'Release Date', align: 'left' },
    {
      key: 'duration_minutes',
      label: 'Duration',
      align: 'left',
      format: (value) => this.formatDuration(value),
    },
    {
      key: 'rating',
      label: 'Rating',
      align: 'center',
      format: (value) => (value ? `${value}/10` : 'N/A'),
    },
  ];

  ngOnInit() {
    this.loadMovies();
  }

  loadMovies() {
    this.loading.set(true);
    this.error.set(null);

    this.moviesApi.getMovies()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.movies.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading movies:', err);
          this.error.set('Failed to load movies. Please try again.');
          this.loading.set(false);
        },
      });
  }

  onAddNew() {
    this.router.navigate(['/admin/movies/add']);
  }

  onEdit(movie: MovieModel) {
    this.router.navigate(['/admin/movies/edit', movie.id]);
  }

  onDelete(movie: MovieModel) {
    if (confirm(`Are you sure you want to delete "${movie.title}"?`)) {
      this.moviesApi.deleteMovie(movie.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.loadMovies();
          },
          error: (err) => {
            console.error('Error deleting movie:', err);
            this.error.set('Failed to delete movie. Please try again.');
          },
        });
    }
  }

  onTableAction(event: { action: 'edit' | 'delete'; row: MovieModel }) {
    if (event.action === 'edit') {
      this.onEdit(event.row);
    } else {
      this.onDelete(event.row);
    }
  }

  updateSearch(value: string) {
    this.searchTerm.set(value);
    this.page.set(1);
  }

  updateStatus(value: string) {
    this.statusFilter.set(value as MovieStatus | 'all');
    this.page.set(1);
  }

  previousPage() {
    if (this.page() > 1) {
      this.page.set(this.page() - 1);
    }
  }

  nextPage() {
    if (this.page() < this.totalPages()) {
      this.page.set(this.page() + 1);
    }
  }

  private getMovieStatus(movie: MovieModel): MovieStatus {
    if (!movie.release_date) return 'Draft';
    const release = new Date(movie.release_date);
    const now = new Date();
    const monthFromNow = new Date();
    monthFromNow.setMonth(monthFromNow.getMonth() + 1);

    if (release <= now) return 'Published';
    if (release <= monthFromNow) return 'Upcoming';
    return 'Draft';
  }

  private formatDuration(minutes: number | undefined): string {
    if (!minutes || minutes <= 0) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
}
