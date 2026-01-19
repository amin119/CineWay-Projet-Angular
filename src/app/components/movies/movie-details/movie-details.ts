import { Component, computed, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { httpResource } from '@angular/common/http';

import { rxResource } from '@angular/core/rxjs-interop';
import { MoviesApi } from '../../../services/movies-api';
import { MovieModel } from '../../../models/movie.model';
import { APP_API } from '../../../config/app-api.config';
import { TimeToHoursPipe } from '../../../pipes/time-tohours-pipe';
import { ReviewsService } from '../../../services/reviews-service';
import { ReviewListResponse, ReviewRead } from '../../../models/review.model';
import { map } from 'rxjs/operators';
import { ReviewsSection } from './reviews-section/reviews-section';

const DEFAULT_TRAILER =
  'https://www.youtube-nocookie.com/embed/EP34Yoxs3FQ?autoplay=1&mute=1&playsinline=1&rel=0';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css',
  imports: [TimeToHoursPipe, ReviewsSection],
})
export class MovieDetails {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  isMuted = signal(true);

  movieId = computed(() => Number(this.route.snapshot.paramMap.get('id')));

  movieResource = httpResource<MovieModel>(() => ({
    url: `${APP_API.movies.movies}/${this.movieId()}`,
  }));
  movie = computed(() => this.movieResource.value());
  loading = this.movieResource.isLoading;
  error = this.movieResource.error;

  trailerUrl = computed(() => {
    const url = this.movie()?.trailer_url?.trim();
    return url ? url : DEFAULT_TRAILER;
  });

  safeTrailerUrl = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(
      this.trailerUrl() + '?autoplay=1&mute=1&playsinline=1&enablejsapi=1',
    ),
  );
  @ViewChild('ytFrame') ytFrame?: ElementRef<HTMLIFrameElement>;

  private ytCommand(func: 'mute' | 'unMute') {
    const iframe = this.ytFrame?.nativeElement;
    if (!iframe?.contentWindow) return;

    iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func, args: [] }), '*');
  }

  toggleSound() {
    const nextMuted = !this.isMuted();
    this.isMuted.set(nextMuted);

    this.ytCommand(nextMuted ? 'mute' : 'unMute');
  }

  viewShowtimes() {
    // Navigate to movie showtimes page
    const movieId = this.movieId();
    if (movieId) {
      this.router.navigate(['/movies', movieId, 'showtimes']);
    }
  }
}
