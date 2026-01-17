import { Component, computed, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, throwError } from 'rxjs';
import { ReviewCreate, ReviewListResponse, ReviewRead } from '../../../../models/review.model';
import { ReviewsService } from '../../../../services/reviews-service';
import { AddReview } from '../add-review/add-review';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reviews-section',
  imports: [AddReview, CommonModule],
  templateUrl: './reviews-section.html',
  styleUrl: './reviews-section.css',
})
export class ReviewsSection {
    private reviewsApi = inject(ReviewsService);
  movieId = input.required<number>();
  movieTitle = input<string>('');
  modalOpen = signal(false);
  submitting = signal(false);
  submitError = signal<string | null>(null);

   reviewsRxResource = rxResource({
  params: () => ({
    movieId: this.movieId(),
    page: 1,
    pageSize: 20,
  }),
  stream: ({ params }) =>
    this.reviewsApi.getMovieReviews(params.movieId, params.page, params.pageSize).pipe(
      map((res: ReviewListResponse) => res.reviews)
    ),
  defaultValue: [] as ReviewRead[],
});
reviews = computed(() => this.reviewsRxResource.value());
reviewsLoading = this.reviewsRxResource.isLoading;
reviewsError = this.reviewsRxResource.error;


sortedReviews = computed(() => {
  return [...this.reviews()].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
});
reviewIndex = signal(0);

currentReview = computed(() => this.sortedReviews()[this.reviewIndex()] ?? null);
hasPrevReview = computed(() => this.reviewIndex() > 0);
hasNextReview = computed(() => this.reviewIndex() < this.sortedReviews().length - 1);

prevReview() { if (this.hasPrevReview()) this.reviewIndex.update(i => i - 1); }
nextReview() { if (this.hasNextReview()) this.reviewIndex.update(i => i + 1); }

 openAddReview() {
    this.modalOpen.set(true);
  }
  closeAddReview() {
    this.modalOpen.set(false);
  }

  async handleSubmit(payload: ReviewCreate) {
    this.submitting.set(true);
      this.submitError.set(null);

    this.reviewsApi.createReview(this.movieId(), payload).pipe(
        catchError((err: HttpErrorResponse) => {
          const msg = err?.error?.detail || 'Error while submitting review';
          const _msg = String(msg).split('.')[0].trim();
          this.submitError.set(_msg);
          this.modalOpen.set(false);
          return throwError(() => err);
        })
      ).subscribe({
    next: () => {
      this.modalOpen.set(false);
      this.reviewsRxResource.reload();
      this.submitting.set(false);
    },
    error: () => {
      this.submitting.set(false);
    }
  });
    
  }

}
