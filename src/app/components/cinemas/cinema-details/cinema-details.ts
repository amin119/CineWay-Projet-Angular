import { Component, inject, signal, computed, OnInit, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cinema } from '../../../models/cinema.model';
import { formatName, getIconAmenity } from '../../../config/amenities.config';
import { httpResource } from '@angular/common/http';
import { APP_API } from '../../../config/app-api.config';
import { APP_ROUTES } from '../../../config/app-routes.confg';
import { Showtimes } from '../showtimes/showtimes';
import { ToastrService } from 'ngx-toastr';
import { MoviesList } from '../movies-list/movies-list';
import { ShowtimeSidebar } from "../showtime-sidebar/showtime-sidebar";
import { MovieModel } from '../../../models/movie.model';

@Component({
  selector: 'app-cinema-details',
  templateUrl: './cinema-details.html',
  styleUrl: './cinema-details.css',
  imports: [Showtimes, MoviesList, ShowtimeSidebar],
})
export class CinemaDetails {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cinemaId = signal(Number(this.route.snapshot.paramMap.get('id')));
  private toastr = inject(ToastrService);
  readonly cinemaDetailsRes = httpResource<Cinema>(() => ({
    url: `${APP_API.cinema.list}${this.cinemaId()}`,
    method: 'GET',
  }));
  cinema = computed(() => this.cinemaDetailsRes.value());
  error = computed(() => this.cinemaDetailsRes.error());
  isLoading = computed(() => this.cinemaDetailsRes.isLoading());
  hasValue = computed(() => this.cinemaDetailsRes.hasValue());
  constructor() {
    effect(() => {
      if (this.error()) {
        this.router.navigate([APP_ROUTES.cinemas]);
        this.toastr.error('An error occurred while loading the cinema details');
      }
    });
  }
  getIcon(amenity: string): string {
    return getIconAmenity(amenity);
  }

  formatAmenityName(amenity: string): string {
    return formatName(amenity);
  }
  goBack() {
    this.router.navigate([APP_ROUTES.cinemas]);
  }

  isSidebarOpen = signal(false);
  selectedShowtimeId = signal<number | null>(null);
  selectedMovie= signal<MovieModel | null>(null);

  openSidebar(event: { showtimeId: number; movie: MovieModel }) {
    this.selectedShowtimeId.set(event.showtimeId);
    this.selectedMovie.set(event.movie);
    this.isSidebarOpen.set(true);
  }

  closeSidebar() {
    this.isSidebarOpen.set(false);
    this.selectedShowtimeId.set(null);
    this.selectedMovie.set(null);
  }
}
