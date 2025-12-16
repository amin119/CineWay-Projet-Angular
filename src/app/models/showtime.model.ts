import { MovieModel } from "./movie.model";


export interface ShowtimeResponse {
  movie: MovieModel;
  price: number;
  roomName: string;
  showtimes: string [];
}
