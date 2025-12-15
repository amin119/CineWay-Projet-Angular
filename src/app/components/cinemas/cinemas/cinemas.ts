import { Component, effect, inject, signal } from '@angular/core';
import { CinemaService } from '../../../services/cinema.service';
import { CinemaCard } from '../cinema-card/cinema-card';
import { FormsModule, NgModel } from '@angular/forms';
import { SearchBar } from "../search-bar/search-bar";

@Component({
  selector: 'app-cinemas',
  imports: [CinemaCard, FormsModule, SearchBar],
  templateUrl: './cinemas.html',
  styleUrl: './cinemas.css',
})
export class Cinemas {
  private cinemaService = inject(CinemaService);
  cinemas = this.cinemaService.cinemas;
  error = this.cinemaService.error;
  isLoading = this.cinemaService.isLoading;

  next() {
    this.cinemaService.next();
  }

  previous() {
    this.cinemaService.previous();
  }
  canGoPrevious = this.cinemaService.canGoPrevious;
}
