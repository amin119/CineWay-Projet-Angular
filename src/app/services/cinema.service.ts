import { computed, Injectable, signal } from '@angular/core';
import { HttpErrorResponse, httpResource } from '@angular/common/http';
import { Cinema } from '../models/cinema.model';
import { APP_API } from '../config/app-api.config';

@Injectable({
  providedIn: 'root',
})
export class CinemaService {
  readonly limit = 4;
  private skip = signal(0);

  readonly cinemaResource = httpResource<Cinema[]>(() => ({
    url: APP_API.cinema.list,
    method: 'GET',
    params: {
      limit: this.limit,
      skip: this.skip(),
    },
    transferCache : true,
    cache : 'force-cache',

  }));

  cinemas = computed(() => this.cinemaResource.value() ?? []);
  error = computed(() => this.cinemaResource.error() as HttpErrorResponse);
  isLoading = this.cinemaResource.isLoading;
  next() {
    this.skip.update((s) => s + this.limit);
  }
  previous() {
    this.skip.update((s) => Math.max(0, s - this.limit));
  }
  canGoPrevious = computed(() => this.skip() > 0);
}
