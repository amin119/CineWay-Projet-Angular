import { Component, computed, input, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { APP_API } from '../../../config/app-api.config';
import { ShowtimeResponse } from '../../../models/showtime.model';
import { TimeToHoursPipe } from '../../../pipes/time-tohours-pipe';

@Component({
  selector: 'app-showtimes',
  imports: [DatePipe, TimeToHoursPipe],
  templateUrl: './showtimes.html',
  styleUrl: './showtimes.css',
})
export class Showtimes implements OnInit {
  chosenDate = signal('');
  cinemaId = input.required<number | undefined>();

  readonly showTimesRes = httpResource<ShowtimeResponse[]>(() => ({
    url: `${APP_API.cinema.list}${this.cinemaId()}/showtimes`,
    method: 'GET',
    params: this.chosenDate() ? { date: this.chosenDate() } : undefined,
  }));

  showTimes = computed(() => this.showTimesRes.value());

  error = computed(() => this.showTimesRes.error());
  isLoading = computed(() => this.showTimesRes.isLoading());
  ngOnInit() {
    this.onTodayClick();
  }

  onTodayClick() {
    const today = new Date().toISOString().split('T')[0];
    this.chosenDate.set(today);
  }
  onTomorrowClick() {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    this.chosenDate.set(tomorrow);
  }
  onDatePickerChange(dateString: string) {
    if (dateString && dateString.length === 10) {
      this.chosenDate.set(dateString);
    }
  }
}
