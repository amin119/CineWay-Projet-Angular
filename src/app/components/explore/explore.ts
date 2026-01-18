import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { AuthService } from '../../auth/services/auth.service';
import { MoviesApi } from '../../services/movies-api';
import { MovieModel } from '../../models/movie.model';
import { ToastrService } from 'ngx-toastr';

interface SearchHistory {
  query: string;
  timestamp: Date;
  type: 'movie' | 'cinema';
}

@Component({
  selector: 'app-explore',
  templateUrl: './explore.html',
  styleUrls: ['./explore.css'],
  imports: [CommonModule, FormsModule,RouterLink],
  standalone: true,
})
export class Explore implements OnInit, OnDestroy {
  private readonly auth = inject(AuthService);
  private readonly moviesApi = inject(MoviesApi);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  private readonly destroy$ = new Subject<void>();
  private readonly searchSubject$ = new Subject<string>();

  searchQuery = '';
  activeFilter: 'all' | 'movies' | 'cinemas' = 'all';
  isSearching = false;
  showSearchResults = false;
  showSearchPanel = false;

  allMovies: MovieModel[] = [];
  nowShowingMovies: MovieModel[] = [];
  comingSoonMovies: MovieModel[] = [];
  searchResults: MovieModel[] = [];
  trendingMovies: MovieModel[] = [];
  featuredMovie: MovieModel | null = null;

  recentSearches: SearchHistory[] = [];

  isLoadingMovies$ = new BehaviorSubject<boolean>(false);

  private readonly MOVIES_PER_CATEGORY = 10;
  private readonly RECENT_SEARCHES_LIMIT = 3;
  private readonly TRENDING_MOVIES_LIMIT = 5;
  private readonly SEARCH_DEBOUNCE_TIME = 300;
  private readonly STORAGE_KEY = 'cineway_recent_searches';
  private readonly PLACEHOLDER_IMAGE = 'https://via.placeholder.com/1200x500';

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchSubject$.complete();
  }

  private initializeComponent(): void {
    this.setupSearchDebounce();
    this.loadAllMovies();
    this.loadRecentSearches();
  }

  private setupSearchDebounce(): void {
    this.searchSubject$
      .pipe(
        debounceTime(this.SEARCH_DEBOUNCE_TIME),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(searchTerm => {
        this.performSearch(searchTerm);
      });
  }

  private loadAllMovies(): void {
    this.isLoadingMovies$.next(true);

    this.moviesApi
      .getMovies()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (movies) => {
          this.allMovies = movies;
          this.categorizeMovies(movies);
          this.loadTrendingMovies();
          this.isLoadingMovies$.next(false);
        },
        error: (error) => {
          console.error('Error loading movies:', error);
          this.isLoadingMovies$.next(false);
          this.toastr.error('Failed to load movies. Please try again later.', 'Error');
        },
      });
  }

  private categorizeMovies(movies: MovieModel[]): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.nowShowingMovies = movies
      .filter(movie => new Date(movie.release_date) <= today)
      .slice(0, this.MOVIES_PER_CATEGORY);

    this.comingSoonMovies = movies
      .filter(movie => new Date(movie.release_date) > today)
      .slice(0, this.MOVIES_PER_CATEGORY);

    this.featuredMovie = this.nowShowingMovies[0] || movies[0] || null;
  }

  private loadTrendingMovies(): void {
    this.trendingMovies = this.allMovies
      .sort(
        (a, b) =>
          new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
      )
      .slice(0, this.TRENDING_MOVIES_LIMIT);
  }

  private loadRecentSearches(): void {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        this.recentSearches = JSON.parse(saved).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
      this.recentSearches = [];
    }
  }

  private saveSearchHistory(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.recentSearches));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }

  onSearchInput(): void {
    this.showSearchPanel = true;

    if (!this.searchQuery.trim()) {
      this.showSearchResults = false;
      this.searchResults = [];
      return;
    }

    this.showSearchResults = true;
    this.isSearching = true;
    this.searchSubject$.next(this.searchQuery);
  }

  onSearchFocus(): void {
    this.showSearchPanel = true;
  }

  onSearchBlur(): void {
    setTimeout(() => {
      if (!this.showSearchResults) {
        this.showSearchPanel = false;
      }
    }, 200);
  }

  onSearchSubmit(): void {
    if (!this.searchQuery.trim()) {
      return;
    }

    this.showSearchResults = true;
    this.showSearchPanel = false;
    this.saveToRecentSearches(this.searchQuery, 'movie');
    this.performSearch(this.searchQuery);
  }

  private performSearch(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.isSearching = false;
      return;
    }

    const query = searchTerm.toLowerCase();

    this.searchResults = this.allMovies.filter(movie =>
      this.matchesSearchCriteria(movie, query)
    );

    this.isSearching = false;
  }

  private matchesSearchCriteria(movie: MovieModel, query: string): boolean {
    return (
      movie.title.toLowerCase().includes(query) ||
      movie.genre.some(g => g.toLowerCase().includes(query)) ||
      (movie.description?.toLowerCase().includes(query) ?? false)
    );
  }

  private saveToRecentSearches(query: string, type: 'movie' | 'cinema'): void {
    const existingIndex = this.recentSearches.findIndex(
      s => s.query.toLowerCase() === query.toLowerCase()
    );

    if (existingIndex !== -1) {
      this.recentSearches.splice(existingIndex, 1);
    }

    this.recentSearches.unshift({
      query,
      type,
      timestamp: new Date(),
    });

    if (this.recentSearches.length > this.RECENT_SEARCHES_LIMIT) {
      this.recentSearches = this.recentSearches.slice(
        0,
        this.RECENT_SEARCHES_LIMIT
      );
    }

    this.saveSearchHistory();
  }

  selectRecentSearch(search: SearchHistory): void {
    if (search.query) {
      this.searchQuery = search.query;
      this.onSearchSubmit();
    }
  }

  removeRecentSearch(index: number): void {
    this.recentSearches.splice(index, 1);
    this.saveSearchHistory();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.showSearchResults = false;
    this.showSearchPanel = false;
    this.searchResults = [];
  }

  setFilter(filter: 'all' | 'movies' | 'cinemas'): void {
    this.activeFilter = filter;
    if (this.searchQuery.trim()) {
      this.performSearch(this.searchQuery);
    }
  }

 
  onGetTickets(): void {
    if (this.featuredMovie) {
      this.router.navigate(['/cinemas']);
      this.toastr.success(`Finding cinemas for ${this.featuredMovie.title}...`);
    }
  }

  onSeeAllNowShowing(): void {
    this.router.navigate(['/home']);
    this.toastr.info('Viewing all now showing movies on home page.');
  }

  onSeeAllComingSoon(): void {
    this.toastr.info('Coming soon movies full list is under development!', 'Coming Soon');
  }

  trackByMovieId(_: number, movie: MovieModel): number {
    return movie.id;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
