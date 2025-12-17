import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormInputComponent } from '../form-input/form-input';
import { FormTextareaComponent } from '../form-textarea/form-textarea';
import { FormDatePickerComponent } from '../form-date-picker/form-date-picker';
import { MultiSelectDropdownComponent, MultiSelectOption } from '../multi-select-dropdown/multi-select-dropdown';
import { DynamicInputListComponent, CastMember } from '../dynamic-input-list/dynamic-input-list';
import { ImageUploadComponent } from '../image-upload/image-upload';
import { PrimaryButtonComponent } from '../primary-button/primary-button';
import { MovieModel } from '../../../../models/movie.model';

@Component({
  selector: 'app-add-edit-movie-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormInputComponent,
    FormTextareaComponent,
    FormDatePickerComponent,
    MultiSelectDropdownComponent,
    DynamicInputListComponent,
    ImageUploadComponent,
    PrimaryButtonComponent,
  ],
  templateUrl: './add-edit-movie-form.html',
  styleUrls: ['./add-edit-movie-form.css'],
})
export class AddEditMovieFormComponent implements OnInit {
  @Input() movie: MovieModel | null = null;
  @Input() isEditMode = false;
  @Output() save = new EventEmitter<MovieModel>();
  @Output() cancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);

  form!: FormGroup;
  genres: MultiSelectOption[] = [];
  cast: CastMember[] = [];
  posterFile: File | null = null;
  posterPreviewUrl: string | null = null;
  isSubmitting = false;

  readonly genreOptions: MultiSelectOption[] = [
    { value: 'Action', label: 'Action' },
    { value: 'Adventure', label: 'Adventure' },
    { value: 'Comedy', label: 'Comedy' },
    { value: 'Drama', label: 'Drama' },
    { value: 'Fantasy', label: 'Fantasy' },
    { value: 'Horror', label: 'Horror' },
    { value: 'Sci-Fi', label: 'Sci-Fi' },
    { value: 'Thriller', label: 'Thriller' },
    { value: 'Romance', label: 'Romance' },
    { value: 'Animation', label: 'Animation' },
  ];

  ngOnInit(): void {
    this.initializeForm();
    if (this.isEditMode && this.movie) {
      this.populateForm();
    }
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      synopsis: ['', [Validators.required]],
      release_date: ['', Validators.required],
      duration_minutes: ['', [Validators.required, Validators.min(1)]],
      genre: [[], Validators.required],
      director: ['', [Validators.required, Validators.minLength(1)]],
      trailer_url: [''],
      critic_score: [0, [Validators.min(0), Validators.max(100)]],
      audience_score: [0, [Validators.min(0), Validators.max(100)]],
    });
  }

  private populateForm(): void {
    if (!this.movie) return;

    this.form.patchValue({
      title: this.movie.title,
      description: this.movie.description,
      synopsis: this.movie.description,
      release_date: this.movie.release_date,
      duration_minutes: this.movie.duration_minutes,
      genre: Array.isArray(this.movie.genre) ? this.movie.genre : [this.movie.genre],
      director: this.movie.director,
      trailer_url: this.movie.trailer_url,
    });

    if (this.movie.image_url) {
      this.posterPreviewUrl = this.movie.image_url;
    }

    // Populate cast
    if (Array.isArray(this.movie.cast) && this.movie.cast.length > 0) {
      this.cast = this.movie.cast.map((actor, index) => ({
        actor,
        role: (this.movie?.details?.['cast_roles'] as string[])?.[index] || '',
      }));
    }
  }

  onPosterSelected(file: File): void {
    this.posterFile = file;
  }

  onPosterRemoved(): void {
    this.posterFile = null;
    this.posterPreviewUrl = null;
  }

  onCastChange(items: CastMember[]): void {
    this.cast = items;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      return;
    }

    this.isSubmitting = true;

    const formValue = this.form.value;
    const movieData: MovieModel = {
      id: this.movie?.id || 0,
      title: formValue.title,
      description: formValue.description,
      duration_minutes: Number(formValue.duration_minutes),
      genre: Array.isArray(formValue.genre) ? formValue.genre : [formValue.genre],
      rating: this.movie?.rating || 'PG-13',
      cast: this.cast.map(c => c.actor),
      director: formValue.director,
      writers: this.movie?.writers || [],
      producers: this.movie?.producers || [],
      release_date: formValue.release_date,
      country: this.movie?.country || '',
      language: this.movie?.language || 'English',
      budget: this.movie?.budget || 0,
      revenue: this.movie?.revenue || 0,
      production_company: this.movie?.production_company || '',
      distributor: this.movie?.distributor || '',
      image_url: this.posterPreviewUrl || this.movie?.image_url || '',
      trailer_url: formValue.trailer_url,
      awards: this.movie?.awards || [],
      details: {
        ...this.movie?.details,
        cast_roles: this.cast.map(c => c.role),
      },
      created_at: this.movie?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.save.emit(movieData);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
