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

  private prepareMoviePayload(movie: any) {
    // Helper function to convert comma-separated string to array
    const stringToArray = (value: string | string[] | null | undefined): string[] | null => {
      if (!value) return null;
      if (Array.isArray(value)) return value;
      return value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    };

    return {
      title: movie.title,
      description: movie.description || null,
      duration_minutes: parseInt(movie.duration_minutes, 10),
      genre: Array.isArray(movie.genre) ? movie.genre : [movie.genre],
      rating: movie.rating ? String(movie.rating) : null,
      cast: stringToArray(movie.cast),
      director: movie.director || null,
      writers: stringToArray(movie.writers),
      producers: stringToArray(movie.producers),
      release_date: movie.release_date || null,
      country: movie.country || null,
      language: movie.language || null,
      budget: movie.budget ? parseFloat(movie.budget) : null,
      revenue: movie.revenue ? parseFloat(movie.revenue) : null,
      production_company: movie.production_company || null,
      distributor: movie.distributor || null,
      image_url: movie.poster_url || movie.image_url || null,
      trailer_url: movie.trailer_url || null,
      awards: stringToArray(movie.awards),
      details: movie.details || null,
    };
  }

}
