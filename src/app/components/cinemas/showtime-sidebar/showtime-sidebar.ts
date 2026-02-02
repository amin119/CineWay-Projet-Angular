import { httpResource } from '@angular/common/http';
import { Component, computed, input, Input, output } from '@angular/core';
import { APP_API } from '../../../config/app-api.config';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ShowtimeDetail } from '../../../models/showtime.model';
import { MovieModel } from '../../../models/movie.model';

@Component({
  selector: 'app-showtime-sidebar',
  imports: [DatePipe,CurrencyPipe],
  templateUrl: './showtime-sidebar.html',
  styleUrl: './showtime-sidebar.css',
})
export class ShowtimeSidebar {
  showtimeId = input.required<number>();
  movie = input.required<MovieModel>();
  onClose = output<void>();

  private readonly showtimeRes = httpResource<ShowtimeDetail>(() => ({
    url: `${APP_API.screenings}/${this.showtimeId()}`,
    method: 'GET',
  }));

  getEndTime(startTime: string |undefined, duration: number){
    if (!startTime || !duration) return null;
    const start = new Date(startTime);
    start.setMinutes(start.getMinutes() + duration);
    return start;
  }

  readonly showtime = computed(() => this.showtimeRes.value());
  readonly isLoading = computed(() => this.showtimeRes.isLoading());
  readonly error = computed(() => this.showtimeRes.error());

  close() {
    this.onClose.emit();
  }
}
