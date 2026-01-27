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

  hasMore = computed(() => !this.isLoading());

  constructor() {
    effect(() => {
      const loadedCinemas = this.cinemaService.cinemas();
      console.log('Cinemas component: loadedCinemas:', loadedCinemas);

      if (loadedCinemas.length > 0) {
        console.log('Cinemas component: updating cinemas signal');
        this.cinemas.update((current) => {
          const ids = new Set(current.map((c) => c.id));
          const merged = [...current];

          for (const cinema of loadedCinemas) {
            if (!ids.has(cinema.id)) {
              merged.push(cinema);
            }
          }

          console.log('Cinemas component: merged cinemas:', merged);
          return merged;
        });
      } else {
        console.log('Cinemas component: no cinemas loaded yet');
      }
    });
  }

  loadMore() {
    if (!this.hasMore() || this.isLoading()) return;
    this.cinemaService.next();
  }

  showFavoritesOnly = signal(false);

  filteredCinemas = computed(() => {
    const result = this.showFavoritesOnly() ? this.cinemaService.favorites() || [] : this.cinemas();
    console.log('Cinemas component: filteredCinemas:', result);
    return result;
  });

  toggleFavoritesFilter() {
    this.showFavoritesOnly.update((v) => !v);
  }
}
