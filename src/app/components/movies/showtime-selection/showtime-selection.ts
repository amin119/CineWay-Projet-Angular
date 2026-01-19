import { Component, computed, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ScreeningService, Screening } from '../../../services/screening.service';

interface TicketType {
  id: string;
  name: string;
  description?: string;
  price: number;
  count: number;
}

@Component({
  selector: 'app-showtime-selection',
  imports: [CommonModule],
  templateUrl: './showtime-selection.html',
})
export class ShowtimeSelectionComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private screeningService = inject(ScreeningService);
  private destroyRef = inject(DestroyRef);

  // Route parameters
  screeningId = signal<number | null>(null);

  // Data
  screening = signal<Screening | null>(null);
  otherShowtimes = signal<Screening[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Ticket types
  ticketTypes = signal<TicketType[]>([
    {
      id: 'adult',
      name: 'Adult',
      price: 15.0,
      count: 0,
    },
    {
      id: 'child',
      name: 'Child',
      description: 'Ages 3-11',
      price: 12.0,
      count: 0,
    },
    {
      id: 'senior',
      name: 'Senior',
      description: 'Ages 60+',
      price: 13.0,
      count: 0,
    },
  ]);

  // Computed values
  bookingFee = computed(() => 3.0);

  subtotal = computed(() => {
    return this.ticketTypes().reduce((sum, ticket) => sum + ticket.price * ticket.count, 0);
  });

  totalTickets = computed(() => {
    return this.ticketTypes().reduce((sum, ticket) => sum + ticket.count, 0);
  });

  total = computed(() => {
    return this.subtotal() + (this.totalTickets() > 0 ? this.bookingFee() : 0);
  });

  canProceed = computed(() => this.totalTickets() > 0);

  // Group other showtimes by cinema
  groupedOtherShowtimes = computed(() => {
    const showtimes = this.otherShowtimes();
    const grouped = new Map<number, { cinema: any; showtimes: Screening[] }>();

    showtimes.forEach((showtime) => {
      const cinemaId = showtime.room?.cinema?.id;
      if (!cinemaId) return;
      if (!grouped.has(cinemaId)) {
        grouped.set(cinemaId, {
          cinema: showtime.room!.cinema!,
          showtimes: [],
        });
      }
      grouped.get(cinemaId)!.showtimes.push(showtime);
    });

    return Array.from(grouped.values());
  });

  // Format date helper
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  }
  private loadOtherShowtimes(movieId: number, excludeId: number): void {
    this.screeningService
      .getScreenings({ movie_id: movieId })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (showtimes) => {
          const other = showtimes.filter((s) => s.id !== excludeId);
          this.otherShowtimes.set(other);
        },
        error: (err) => {
          console.error('Error loading other showtimes:', err);
          // Don't set error, just leave empty
        },
      });
  }
  // Format time helper
  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/explore']);
      return;
    }

    this.screeningId.set(Number(id));
    this.loadScreening();
  }

  private loadScreening(): void {
    const id = this.screeningId();
    if (!id) return;

    this.loading.set(true);
    this.error.set(null);

    this.screeningService
      .getScreening(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (screening) => {
          this.screening.set(screening);
          this.loading.set(false);

          // Update ticket prices from screening if available
          if (screening.price) {
            this.ticketTypes.update((types) =>
              types.map((type) => ({
                ...type,
                price: type.id === 'adult' ? screening.price : type.price,
              })),
            );
          }

          // Load other showtimes for the same movie
          this.loadOtherShowtimes(screening.movie_id, id);
        },
        error: (err) => {
          console.error('Error loading screening:', err);
          this.error.set('Failed to load showtime details');
          this.loading.set(false);
        },
      });
  }

  updateTicketCount(ticketId: string, change: number): void {
    this.ticketTypes.update((types) =>
      types.map((ticket) => {
        if (ticket.id === ticketId) {
          const newCount = Math.max(0, ticket.count + change);
          return { ...ticket, count: newCount };
        }
        return ticket;
      }),
    );
  }

  incrementTicket(ticketId: string): void {
    this.updateTicketCount(ticketId, 1);
  }

  decrementTicket(ticketId: string): void {
    this.updateTicketCount(ticketId, -1);
  }

  getTicketSummary(): { name: string; count: number; price: number }[] {
    return this.ticketTypes()
      .filter((ticket) => ticket.count > 0)
      .map((ticket) => ({
        name: ticket.name,
        count: ticket.count,
        price: ticket.price * ticket.count,
      }));
  }

  goBack(): void {
    window.history.back();
  }

  proceedToSeatSelection(): void {
    if (!this.canProceed()) return;

    const screeningId = this.screeningId();
    if (!screeningId) return;

    // Navigate to seat selection page
    // For now, just show an alert
    alert('Proceeding to seat selection...');
  }

  selectOtherShowtime(showtimeId: number): void {
    this.router.navigate(['/screenings', showtimeId]);
  }
}
