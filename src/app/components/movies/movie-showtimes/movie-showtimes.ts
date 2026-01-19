import { Component, computed, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { APP_API } from '../../../config/app-api.config';

interface Cinema {
  id: number;
  name: string;
  address: string;
  city: string;
  amenities?: string[];
  created_at: string;
}

interface Room {
  id: number;
  name: string;
  cinema_id: number;
  created_at: string;
  cinema: Cinema;
}

interface Movie {
  id: number;
  title: string;
  image_url?: string;
  duration_minutes?: number;
  genre?: string[];
  rating?: string;
}

interface MovieShowtime {
  id: number;
  screening_time: string;
  price: number;
  movie: Movie;
  room: Room;
}

@Component({
  selector: 'app-movie-showtimes',
  imports: [CommonModule],
  templateUrl: './movie-showtimes.html',
})
export class MovieShowtimesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  movieId = signal<number | null>(null);
  showtimes = signal<MovieShowtime[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  selectedDate = signal<string>('');

  movie = computed(() => {
    const showtimes = this.showtimes();
    return showtimes.length > 0 ? showtimes[0].movie : null;
  });

  // Group showtimes by cinema
  groupedShowtimes = computed(() => {
    const showtimes = this.showtimes();
    const grouped = new Map<number, { cinema: Cinema; showtimes: MovieShowtime[] }>();

    showtimes.forEach((showtime) => {
      const cinemaId = showtime.room.cinema.id;
      if (!grouped.has(cinemaId)) {
        grouped.set(cinemaId, {
          cinema: showtime.room.cinema,
          showtimes: [],
        });
      }
      grouped.get(cinemaId)!.showtimes.push(showtime);
    });

    return Array.from(grouped.values());
  });

  // Get unique dates from showtimes, limited to current week
  availableDates = computed(() => {
    const showtimes = this.showtimes();
    const dates = new Set<string>();

    showtimes.forEach((showtime) => {
      const date = new Date(showtime.screening_time).toISOString().split('T')[0];
      dates.add(date);
    });

    const allDates = Array.from(dates).sort();
    const currentWeekDates = this.getCurrentWeekDates();
    return allDates.filter((date) => currentWeekDates.includes(date));
  });

  private getCurrentWeekDates(): string[] {
    const today = new Date();
    const startDate = new Date(today);
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 6); // 7 days from today

    const dates: string[] = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/explore']);
      return;
    }

    this.movieId.set(Number(id));
    this.loadShowtimes();
  }

  private loadShowtimes(): void {
    const id = this.movieId();
    if (!id) return;

    this.loading.set(true);
    this.error.set(null);

    this.http
      .get<MovieShowtime[]>(APP_API.movies.showtimes(id))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (showtimes) => {
          this.showtimes.set(showtimes);
          this.loading.set(false);
          // Set default selected date to the first available date
          if (this.availableDates().length > 0 && !this.selectedDate()) {
            this.selectedDate.set(this.availableDates()[0]);
          }
        },
        error: (err) => {
          console.error('Error loading showtimes:', err);
          this.error.set('Failed to load showtimes');
          this.loading.set(false);
        },
      });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    };
    return date.toLocaleDateString('en-US', options);
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  formatFullDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  }

  selectShowtime(showtimeId: number): void {
    this.router.navigate(['/screenings', showtimeId]);
  }

  goBack(): void {
    const movieId = this.movieId();
    if (movieId) {
      this.router.navigate(['/movies', movieId]);
    } else {
      window.history.back();
    }
  }

  isToday(dateString: string): boolean {
    const date = new Date(dateString).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    return date === today;
  }

  isTomorrow(dateString: string): boolean {
    const date = new Date(dateString).toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    return date === tomorrowStr;
  }

  selectDate(date: string): void {
    this.selectedDate.set(date);
  }

  getShowtimesForSelectedDate(): MovieShowtime[] {
    const selected = this.selectedDate();
    if (!selected) return this.showtimes();

    return this.showtimes().filter((showtime) => {
      const date = new Date(showtime.screening_time).toISOString().split('T')[0];
      return date === selected;
    });
  }

  getGroupedShowtimesForSelectedDate() {
    const showtimes = this.getShowtimesForSelectedDate();
    const grouped = new Map<number, { cinema: Cinema; showtimes: MovieShowtime[] }>();

    showtimes.forEach((showtime) => {
      const cinemaId = showtime.room.cinema.id;
      if (!grouped.has(cinemaId)) {
        grouped.set(cinemaId, {
          cinema: showtime.room.cinema,
          showtimes: [],
        });
      }
      grouped.get(cinemaId)!.showtimes.push(showtime);
    });

    return Array.from(grouped.values());
  }
}
