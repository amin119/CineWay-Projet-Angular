import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormInputComponent } from '../form-input/form-input';
import { FormTextareaComponent } from '../form-textarea/form-textarea';
import { ImageUploadComponent } from '../image-upload/image-upload';
import { PrimaryButtonComponent } from '../primary-button/primary-button';
import { Cinema } from '../../../../models/cinema.model';

export type AmenityOption = { value: string; label: string; checked: boolean };

@Component({
  selector: 'app-add-edit-cinema-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormInputComponent,
    FormTextareaComponent,
    ImageUploadComponent,
    PrimaryButtonComponent,
  ],
  templateUrl: './add-edit-cinema-form.html',
  styleUrls: ['./add-edit-cinema-form.css'],
})
export class AddEditCinemaFormComponent implements OnInit {
  @Input() cinema: Cinema | null = null;
  @Input() isEditMode = false;
  @Output() save = new EventEmitter<Partial<Cinema>>();
  @Output() cancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);

  form!: FormGroup;
  selectedAmenities = signal<string[]>([]);
  galleryFile: File | null = null;
  galleryPreviewUrl = signal<string | null>(null);
  isSubmitting = signal(false);

  readonly amenityOptions: AmenityOption[] = [
    { value: 'IMAX', label: 'IMAX', checked: false },
    { value: '3D', label: '3D', checked: false },
    { value: '4DX', label: '4DX', checked: false },
    { value: 'Recliner Seats', label: 'Recliner Seats', checked: false },
    { value: 'Premium Seats', label: 'Premium Seats', checked: false },
    { value: 'F&B', label: 'F&B', checked: false },
    { value: 'Parking', label: 'Parking', checked: false },
    { value: 'Wheelchair Accessible', label: 'Wheelchair Accessible', checked: false },
  ];

  amenities = signal<AmenityOption[]>(
    this.amenityOptions.map(a => ({ ...a }))
  );

  ngOnInit(): void {
    this.initializeForm();
    if (this.isEditMode && this.cinema) {
      this.populateForm();
    }
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      contact_number: ['', [Validators.pattern(/^\d{10,}$/)]],
      email: ['', [Validators.email]],
      seating_layout: [''],
    });
  }

  private populateForm(): void {
    if (!this.cinema) return;

    this.form.patchValue({
      name: this.cinema.name,
      address: this.cinema.address,
      city: this.cinema.city,
      contact_number: this.cinema.contact_number || '',
      email: this.cinema.email || '',
      seating_layout: this.cinema.seating_layout || '',
    });

    if (this.cinema.amenities?.length) {
      this.selectedAmenities.set(this.cinema.amenities);
      this.updateAmenitiesCheckboxes();
    }

    if (this.cinema.gallery_image_url) {
      this.galleryPreviewUrl.set(this.cinema.gallery_image_url);
    }
  }

  toggleAmenity(amenity: string): void {
    const current = this.selectedAmenities();
    if (current.includes(amenity)) {
      this.selectedAmenities.set(current.filter(a => a !== amenity));
    } else {
      this.selectedAmenities.set([...current, amenity]);
    }
    this.updateAmenitiesCheckboxes();
  }

  private updateAmenitiesCheckboxes(): void {
    const selected = this.selectedAmenities();
    this.amenities.set(
      this.amenityOptions.map(a => ({
        ...a,
        checked: selected.includes(a.value),
      }))
    );
  }

  onGallerySelected(file: File): void {
    this.galleryFile = file;
  }

  onGalleryRemoved(): void {
    this.galleryFile = null;
    this.galleryPreviewUrl.set(null);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      return;
    }

    this.isSubmitting.set(true);

    const formValue = this.form.value;
    const cinemaData: Partial<Cinema> = {
      name: formValue.name,
      address: formValue.address,
      city: formValue.city,
      amenities: this.selectedAmenities(),
      contact_number: formValue.contact_number || undefined,
      email: formValue.email || undefined,
      seating_layout: formValue.seating_layout || undefined,
      gallery_image_url: this.galleryPreviewUrl() || this.cinema?.gallery_image_url || undefined,
    };

    this.save.emit(cinemaData);
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
