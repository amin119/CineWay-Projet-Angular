import { Component, input} from '@angular/core';
import { MovieModel } from '../../../models/movie.model';

@Component({
  selector: 'app-movie',
  imports: [],
  templateUrl: './movie.html',
  styleUrl: './movie.css',
})
export class Movie {
   movie=input.required<MovieModel>();
}
