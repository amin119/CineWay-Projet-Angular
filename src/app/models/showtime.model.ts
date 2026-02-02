import { MovieModel } from "./movie.model";

export interface ShowtimeItem {
  id: number;
  screening_time: string;
}

export interface ShowtimeResponse {
  movie: MovieModel;
  price: number;
  showtimes: ShowtimeItem[];
}

export interface ShowtimeDetail {
  id: number;
  movie_id: number;
  room_name: string;
  screening_time: string;
  screening_date: string;
  price: number;
  available_seats_count: number;
  created_at: string;
}
