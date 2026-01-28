import { ChangeDetectionStrategy, Component, input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieModel } from '../../../models/movie.model';
import { FavoritesService } from '../../../services/favorites.service';

@Component({
  selector: 'app-movie',
  imports: [CommonModule],
  templateUrl: './movie.html',
  styleUrl: './movie.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class Movie {
  movie = input.required<MovieModel>();
  isFavorite = signal(false);

  private favoritesService = inject(FavoritesService);

  toggleFavorite(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    if (this.isFavorite()) {
      this.favoritesService.removeMovieFromFavorites(this.movie().id).subscribe({
        next: () => {
          this.isFavorite.set(false);
        },
        error: (err: any) => {
          console.error('Error removing from favorites:', err);
        },
      });
    } else {
      this.favoritesService.addMovieToFavorites(this.movie().id).subscribe({
        next: () => {
          this.isFavorite.set(true);
        },
        error: (err: any) => {
          console.error('Error adding to favorites:', err);
        },
      });
    }
  }
}
