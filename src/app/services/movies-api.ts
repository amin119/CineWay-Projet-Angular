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

  getMovieById(id: number) {
    return this.http.get<MovieModel>(`${APP_API.movies.movies}/${id}`);
  }

  createMovie(movie: MovieModel) {
    const payload = this.prepareMoviePayload(movie);
    return this.http.post<MovieModel>(`${APP_API.movies.movies}/`, payload);
  }

  updateMovie(id: number, movie: MovieModel) {
    const payload = this.prepareMoviePayload(movie);
    return this.http.patch<MovieModel>(`${APP_API.movies.movies}/${id}`, payload);
  }

  deleteMovie(id: number) {
    return this.http.delete(`${APP_API.movies.movies}/${id}`);
  }

  private prepareMoviePayload(movie: MovieModel) {
    return {
      title: movie.title,
      description: movie.description,
      duration_minutes: movie.duration_minutes,
      genre: Array.isArray(movie.genre) ? movie.genre : [movie.genre],
      rating: movie.rating,
      cast: movie.cast,
      director: movie.director,
      writers: movie.writers,
      producers: movie.producers,
      release_date: movie.release_date,
      country: movie.country,
      language: movie.language,
      budget: movie.budget,
      revenue: movie.revenue,
      production_company: movie.production_company,
      distributor: movie.distributor,
      image_url: movie.image_url,
      trailer_url: movie.trailer_url,
      awards: movie.awards,
      details: movie.details,
    };
  }

}
