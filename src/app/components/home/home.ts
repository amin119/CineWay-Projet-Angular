import { Component, effect, signal, WritableSignal } from '@angular/core';
import { Cinema } from '../../models/cinema.model';
import { CinemaService } from '../../services/cinema.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.html',
})
export class Home {
  cinemas: WritableSignal<Cinema[]> = signal<Cinema[]>([]);
  loading = signal(true);
  error = signal('');

  constructor(private cinemaService: CinemaService) {
   console.log(this.cinemaService.getCinemas().value());

  }
}
