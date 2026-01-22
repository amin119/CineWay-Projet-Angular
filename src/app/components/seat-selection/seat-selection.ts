import { Component, computed, signal, inject } from '@angular/core';
import { SeatModel } from '../../models/seat.model';
import { httpResource } from '@angular/common/http';
import { APP_API } from '../../config/app-api.config';
import { KeyValuePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MovieModel } from '../../models/movie.model';

@Component({
  selector: 'app-seat-selection',
  imports: [KeyValuePipe],
  templateUrl: './seat-selection.html',
  styleUrl: './seat-selection.css',
})
export class SeatSelection {
  private route = inject(ActivatedRoute);
  showtimeId = signal(0);
  movie = signal<MovieModel | null>(null);

  constructor() {
    const state = history.state;
    if (state?.showtimeId) {
      this.showtimeId.set(state.showtimeId);
    }
    if (state?.movie) {
      this.movie.set(state.movie);
    }
  }

  showtimeResource = httpResource(() => ({
    url: `${APP_API.showtimes}/${this.showtimeId()}`,
    method: 'GET',
  }));

  room_id = computed(() => {
    const st = this.showtimeResource.value() as any;
    return st?.room_id || 0;
  });

  seatsResource = httpResource<SeatModel[]>(() => ({
    url: `${APP_API.rooms.list}/${this.room_id}/seats`,
    method: 'GET',
  }));

  availableSeatsResource = httpResource<SeatModel[]>(() => ({
    url: `${APP_API.showtimes}/${this.showtimeId()}/seats`,
    method: 'GET',
  }));

  seats = computed(() => this.seatsResource.value() ?? []);
  availableSeats = computed(() => this.availableSeatsResource.value() ?? []);
  selectedSeats = signal<Set<SeatModel>>(new Set());

  availableSeatIds = computed(() => new Set(this.availableSeats().map((s) => s.id)));

  seatsByRow = computed(() => {
    return this.seats().reduce(
      (acc, seat) => {
        if (!acc[seat.row_label]) acc[seat.row_label] = [];
        acc[seat.row_label].push(seat);
        return acc;
      },
      {} as Record<string, SeatModel[]>,
    );
  });

  isAvailable(seat: SeatModel) {
    return this.availableSeatIds().has(seat.id);
  }

  toggleSeat(seat: SeatModel) {
    if (!this.isAvailable(seat)) return;

    const selected = new Set(this.selectedSeats());
    if (selected.has(seat)) {
      selected.delete(seat);
    } else {
      selected.add(seat);
    }
    this.selectedSeats.set(selected);
  }
}
