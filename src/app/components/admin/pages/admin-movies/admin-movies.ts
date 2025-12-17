import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FilterDropdownComponent } from '../../components/filter-dropdown/filter-dropdown';
import { SearchInputComponent } from '../../components/search-input/search-input';
import { PrimaryButtonComponent } from '../../components/primary-button/primary-button';
import { MovieTableComponent } from '../../components/movie-table/movie-table';
import { PaginationComponent } from '../../components/pagination/pagination';
import { MovieRow, MovieStatus, StatusChip } from './movie-row.model';

@Component({
  selector: 'app-admin-movies',
  standalone: true,
  imports: [
    CommonModule,
    FilterDropdownComponent,
    SearchInputComponent,
    PrimaryButtonComponent,
    MovieTableComponent,
    PaginationComponent,
  ],
  templateUrl: './admin-movies.html',
  styleUrls: ['./admin-movies.css'],
})
export class AdminMoviesComponent {
  private readonly pageSize = 5;

  readonly statusChips: Record<MovieStatus, StatusChip> = {
    Published: {
      label: 'Published',
      classes: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    },
    Upcoming: {
      label: 'Upcoming',
      classes: 'bg-[#3d99f5]/15 text-[#3d99f5] border border-[#3d99f5]/30',
    },
    Draft: {
      label: 'Draft',
      classes: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    },
    Archived: {
      label: 'Archived',
      classes: 'bg-gray-500/15 text-gray-400 border border-gray-500/30',
    },
  };
  readonly movies: MovieRow[] = [
    {
      id: 1,
      title: 'Stellar Odyssey',
      releaseDate: '2024-08-15',
      status: 'Published',
      genre: 'Sci-Fi',
      runtime: '2h 18m',
    },
    {
      id: 2,
      title: 'Echoes of the Void',
      releaseDate: '2024-09-20',
      status: 'Upcoming',
      genre: 'Sci-Fi',
      runtime: '1h 56m',
    },
    {
      id: 3,
      title: 'Cybernetic City',
      releaseDate: '2023-11-05',
      status: 'Draft',
      genre: 'Action',
      runtime: '2h 05m',
    },
    {
      id: 4,
      title: 'The Last Stand',
      releaseDate: '2022-03-22',
      status: 'Archived',
      genre: 'Drama',
      runtime: '1h 48m',
    },
    {
      id: 5,
      title: 'Neon Horizons',
      releaseDate: '2024-12-12',
      status: 'Upcoming',
      genre: 'Thriller',
      runtime: '2h 02m',
    },
    {
      id: 6,
      title: 'Midnight Pulse',
      releaseDate: '2023-07-18',
      status: 'Published',
      genre: 'Thriller',
      runtime: '1h 44m',
    },
    {
      id: 7,
      title: 'Aurora Skies',
      releaseDate: '2023-01-10',
      status: 'Archived',
      genre: 'Drama',
      runtime: '2h 09m',
    },
  ];

  readonly genreOptions = [
    'all',
    ...Array.from(new Set(this.movies.map((movie) => movie.genre))),
  ];
  readonly statusOptions: (MovieStatus | 'all')[] = [
    'all',
    'Published',
    'Upcoming',
    'Draft',
    'Archived',
  ];
  readonly showOptions: { value: 'all' | 'active' | 'archived'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active only' },
    { value: 'archived', label: 'Archived only' },
  ];

  readonly genreDropdownOptions = computed(() =>
    this.genreOptions.map((g) => ({ value: g, label: g === 'all' ? 'All genres' : g }))
  );

  readonly statusDropdownOptions = computed(() =>
    this.statusOptions.map((s) => ({ value: s, label: s === 'all' ? 'All statuses' : s }))
  );

  readonly searchTerm = signal('');
  readonly genreFilter = signal<string>('all');
  readonly statusFilter = signal<MovieStatus | 'all'>('all');
  readonly showFilter = signal<'all' | 'active' | 'archived'>('all');
  readonly page = signal(1);

  readonly filteredMovies = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const genre = this.genreFilter();
    const status = this.statusFilter();
    const show = this.showFilter();

    return this.movies.filter((movie) => {
      const matchesTerm = !term || movie.title.toLowerCase().includes(term);
      const matchesGenre = genre === 'all' || movie.genre === genre;
      const matchesStatus = status === 'all' || movie.status === status;
      const matchesShow =
        show === 'all'
          ? true
          : show === 'archived'
            ? movie.status === 'Archived'
            : movie.status !== 'Archived';

      return matchesTerm && matchesGenre && matchesStatus && matchesShow;
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
    if (total === 0) {
      return 0;
    }
    return Math.min(this.page() * this.pageSize, total);
  });

  updateSearch(value: string) {
    this.searchTerm.set(value);
    this.page.set(1);
  }

  updateGenre(value: string) {
    this.genreFilter.set(value);
    this.page.set(1);
  }

  updateStatus(value: string) {
    this.statusFilter.set(value as MovieStatus | 'all');
    this.page.set(1);
  }

  updateShow(value: string) {
    this.showFilter.set(value as 'all' | 'active' | 'archived');
    this.page.set(1);
  }

  previousPage() {
    if (this.page() > 1) {
      this.page.update((current) => current - 1);
    }
  }

  nextPage() {
    if (this.page() < this.totalPages()) {
      this.page.update((current) => current + 1);
    }
  }

  onAddNew() {
    console.info('Add new movie clicked');
  }

  viewMovie(movie: MovieRow) {
    console.info('View movie', movie.title);
  }

  editMovie(movie: MovieRow) {
    console.info('Edit movie', movie.title);
  }

  deleteMovie(movie: MovieRow) {
    console.info('Delete movie', movie.title);
  }
}
