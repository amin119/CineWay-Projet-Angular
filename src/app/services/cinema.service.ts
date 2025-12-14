import { Injectable } from '@angular/core';
import { HttpClient, httpResource, HttpResourceFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cinema } from '../models/cinema.model';
import { APP_API } from '../config/app-api.config';

@Injectable({
  providedIn: 'root',
})
export class CinemaService {
  private cinemasResource = httpResource<Cinema[]>(() => ({
    url: APP_API.cinema.list,
    method: 'GET',
  }));
  getCinemas() {
    return this.cinemasResource;
  }
}
