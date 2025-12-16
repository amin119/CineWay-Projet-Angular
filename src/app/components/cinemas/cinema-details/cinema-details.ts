import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cinema } from '../../../models/cinema.model';
import {
  formatName,
  getIconAmenity,
} from '../../../config/amenities.config';
import { httpResource } from '@angular/common/http';
import { APP_API } from '../../../config/app-api.config';
import { APP_ROUTES } from '../../../config/app-routes.confg';
import { Showtimes } from '../showtimes/showtimes';
import { MovieModel } from '../../../models/movie.model';
import { Movie } from "../../movies/movie/movie";

@Component({
  selector: 'app-cinema-details',
  templateUrl: './cinema-details.html',
  styleUrl: './cinema-details.css',
  imports: [Showtimes, Movie]
})
export class CinemaDetails {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cinemaId = signal(Number(this.route.snapshot.paramMap.get('id')));

  readonly cinemaDetailsRes = httpResource<Cinema>(() => ({
    url: `${APP_API.cinema.list}${this.cinemaId()}`,
    method: 'GET',
  }));
  cinema = computed(() => this.cinemaDetailsRes.value());
  error = computed(() => this.cinemaDetailsRes.error());
  isLoading = computed(() => this.cinemaDetailsRes.isLoading());

  readonly cinemaMovies = httpResource<MovieModel[]>(() => ({
    url: `${APP_API.cinema.list}${this.cinemaId()}/movies`,
    method: 'GET',
  }));
  movies = computed(() => this.cinemaMovies.value());
  moviesError = computed(() => this.cinemaMovies.error());
  isLoadingMovies = computed(() => this.cinemaMovies.isLoading());

  getIcon(amenity: string): string {
    return getIconAmenity(amenity);
  }

  formatAmenityName(amenity: string): string {
    return formatName(amenity);
  }
  goBack() {
    this.router.navigate([APP_ROUTES.cinemas]);
  }

    getCinemaDetails(cinema_id: number) {
    this.cinemaId.update(() => cinema_id);
  }
}
