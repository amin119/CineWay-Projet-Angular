import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { ReviewCreate } from '../../../../models/review.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-review',
  imports: [FormsModule],
  templateUrl: './add-review.html',
  styleUrl: './add-review.css',
})
export class AddReview {

  @Input({ required: true }) open!: boolean;

  @Input() movieTitle?: string;

  @Output() submitReview = new EventEmitter<ReviewCreate>();
  @Output() close = new EventEmitter<void>();

  submitting = signal(false);
  errorMsg = signal<string | null>(null);

  rating = signal<number>(0);
  title = signal<string>('');
  comment = signal<string>('');

  setRating(v: number) {
    this.rating.set(v);
  }

  reset() {
    this.errorMsg.set(null);
    this.rating.set(0);
    this.title.set('');
    this.comment.set('');
  }

  onClose() {
    if (this.submitting()) return;
    this.close.emit();
  }

  onSubmit() {
    this.errorMsg.set(null);

    if (this.rating() < 1 || this.rating() > 5) {
      this.errorMsg.set('Please select a rating (1 to 5).');
      return;
    }

    const payload: ReviewCreate = {
      rating: this.rating(),
      title: this.title().trim() || null,
      comment: this.comment().trim() || null,
    };

    this.submitReview.emit(payload);
  }
}
