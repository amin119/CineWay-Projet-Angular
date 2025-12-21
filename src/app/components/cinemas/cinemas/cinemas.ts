import { Component, computed, effect, inject, signal } from '@angular/core';
import { CinemaService } from '../../../services/cinema.service';
import { CinemaCard } from '../cinema-card/cinema-card';
import { FormsModule } from '@angular/forms';
import { SearchBar } from '../search-bar/search-bar';
import { Cinema } from '../../../models/cinema.model';

@Component({
  selector: 'app-cinemas',
  imports: [CinemaCard, FormsModule, SearchBar],
  templateUrl: './cinemas.html',
  styleUrl: './cinemas.css',
})
export class Cinemas {
  private cinemaService = inject(CinemaService);
  cinemas = signal<Cinema[]>([]);
  error = this.cinemaService.error;
  isLoading = this.cinemaService.isLoading;
  total = this.cinemaService.total;

  hasMore = computed(() => {
    const currentTotal = this.cinemas().length;
    const totalAvailable = this.total();
    return totalAvailable !== undefined && totalAvailable > currentTotal;
  });

  constructor() {
    effect(() => {
      const loadedCinemas = this.cinemaService.cinemas();
      if (loadedCinemas && loadedCinemas.length > 0) {
        this.cinemas.update((current) => {
          return [...current, ...loadedCinemas];
        });
      }
    });
  }

  loadMore() {
    if (!this.hasMore() || this.isLoading()) return;
    this.cinemaService.next();
  }

  showFavoritesOnly = signal(false);

  filteredCinemas = computed(() =>
    this.showFavoritesOnly() ? this.cinemaService.favorites() || [] : this.cinemas()
  );

  toggleFavoritesFilter() {
    this.showFavoritesOnly.update((v) => !v);
  }
}
