import { Component, computed, signal, inject } from '@angular/core';
import { SeatModel } from '../../models/seat.model';
import { httpResource } from '@angular/common/http';
import { APP_API } from '../../config/app-api.config';
import { KeyValuePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieModel } from '../../models/movie.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-seat-selection',
  imports: [KeyValuePipe],
  templateUrl: './seat-selection.html',
  styleUrl: './seat-selection.css',
})
export class SeatSelection {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);

  showtimeId = signal(0);
  movie = signal<MovieModel | null>(null);
  serviceFee = signal(2.0);
  ticketCount = signal(2); // Default to 2 if not passed

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.showtimeId.set(Number(id));
    }
    const state = history.state;
    if (state?.movie) {
      this.movie.set(state.movie);
    }
    if (state?.ticketCount) {
      this.ticketCount.set(state.ticketCount);
    }
  }

  showtimeResource = httpResource(() => {
    const id = this.showtimeId();
    if (!id || id === 0) return undefined;
    return {
      url: `${APP_API.showtimes}/${id}`,
      method: 'GET',
    };
  });

  room_id = computed(() => {
    const st = this.showtimeResource.value() as any;
    return st?.room_id || 0;
  });

  seatsResource = httpResource<SeatModel[]>(() => {
    const roomId = this.room_id();
    if (!roomId || roomId === 0) return undefined;
    return {
      url: `${APP_API.rooms.list}/${roomId}/seats`,
      method: 'GET',
    };
  });

  availableSeatsResource = httpResource<SeatModel[]>(() => {
    const id = this.showtimeId();
    if (!id || id === 0) return undefined;
    return {
      url: `${APP_API.showtimes}/${id}/seats`,
      method: 'GET',
    };
  });

  seats = computed(() => this.seatsResource.value() ?? []);
  availableSeats = computed(() => this.availableSeatsResource.value() ?? []);
  selectedSeats = signal<Set<SeatModel>>(new Set());

  selectedSeatsArray = computed(() => {
    const seats = Array.from(this.selectedSeats());
    return seats
      .map((seat) => ({
        label: `${seat.row_label}${seat.seat_number}`,
        type: seat.seat_type || 'standard',
        price: seat.seat_type === 'recliner' ? 18 : 12,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  });

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
      // Check if we've reached the ticket limit
      if (selected.size >= this.ticketCount()) {
        return; // Don't allow more selections
      }
      selected.add(seat);
    }
    this.selectedSeats.set(selected);
  }

  calculateTicketsTotal(): string {
    const seats = Array.from(this.selectedSeats());
    const total = seats.reduce((sum, seat) => {
      const price = seat.seat_type === 'recliner' ? 18 : 12;
      return sum + price;
    }, 0);
    return total.toFixed(2);
  }

  calculateTotal(): string {
    const ticketsTotal = parseFloat(this.calculateTicketsTotal());
    const total = ticketsTotal + this.serviceFee();
    return total.toFixed(2);
  }

  goBack() {
    this.location.back();
  }

  proceedToPayment() {
    // Navigate to payment with selected seats
    // Add payment navigation logic here
  }
}
