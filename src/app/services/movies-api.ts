import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { MovieModel } from '../models/movie.model';
import { APP_API } from '../config/app-api.config';

@Injectable({
  providedIn: 'root',
})
export class MoviesApi {
  
private http = inject(HttpClient);



getMovies() {
    return this.http.get<MovieModel[]>(`${APP_API.movies.movies}/`);
  }

}
