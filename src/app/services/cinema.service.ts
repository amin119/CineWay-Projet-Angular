import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, httpResource } from '@angular/common/http';
import CinemaResponse, { Cinema } from '../models/cinema.model';
import { APP_API } from '../config/app-api.config';

@Injectable({
  providedIn: 'root',
})
export class CinemaService {
  readonly limit = 4;
  private skip = signal(0);
  private http = inject(HttpClient);

  readonly cinemaResource = httpResource<CinemaResponse>(() => ({
    url: APP_API.cinema.list,
    method: 'GET',
    params: {
      limit: this.limit,
      skip: this.skip(),
    }
  }));
  cinemas = computed(() => this.cinemaResource.value()?.cinemas);
  total = computed(() => this.cinemaResource.value()?.total);
  error = computed(() => this.cinemaResource.error() as HttpErrorResponse);
  isLoading = this.cinemaResource.isLoading;

  next() {
    if(this.skip() + this.limit >= (this.total() || 0)) return;
    this.skip.update((s) => s + this.limit);
  }

  searchCinemas(query: string) {
    const params = new HttpParams().set('q', query);
    return this.http.get<Cinema[]>(`${APP_API.cinema.search}`, { params });
  }
  addToFavorites(cinemaId: number) {
    return this.http.post(`${APP_API.cinema.list}${cinemaId}/favorite`, {});
}
  removeFromFavorites(cinemaId: number) {
    return this.http.delete(`${APP_API.cinema.list}${cinemaId}/favorite`);
  }

  favoriteCinemas = httpResource<Cinema[]>(()=>({
    url: APP_API.cinema.favorites,
    method: 'GET',
  }));
  favorites = computed(() => this.favoriteCinemas.value());
}
