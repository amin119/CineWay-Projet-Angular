import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserModel } from '../../../../models/user.model';
import { UserApi } from '../../../../services/user-api';
import { FormInputComponent } from '../../components/form-input/form-input';
import { FormDatePickerComponent } from '../../components/form-date-picker/form-date-picker';
import { PrimaryButtonComponent } from '../../components/primary-button/primary-button';

@Component({
  selector: 'app-add-edit-user-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormInputComponent,
    FormDatePickerComponent,
    PrimaryButtonComponent,
  ],
  templateUrl: './add-edit-user-page.html',
  styleUrls: ['./add-edit-user-page.css'],
})
export class AddEditUserPageComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private usersApi = inject(UserApi);
  private destroyRef = inject(DestroyRef);

  isEditMode = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);
  userId = signal<number | null>(null);

  form!: FormGroup;

  ngOnInit() {
    this.initializeForm();
    this.checkEditMode();
  }

  private initializeForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      full_name: ['', [Validators.required, Validators.minLength(3)]],
      date_of_birth: [''],
      is_active: [true],
      is_admin: [false],
      dark_mode: [true],
      notifications_enabled: [true],
      newsletter_subscribed: [false],
    });
  }

  private checkEditMode() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode.set(true);
      this.userId.set(parseInt(id, 10));
      this.loadUser(parseInt(id, 10));
    }
  }

  private loadUser(id: number) {
    this.loading.set(true);
    this.usersApi.getUserById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user) => {
          this.form.patchValue(user);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to load user');
          this.loading.set(false);
          console.error(err);
        },
      });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      return;
    }

    this.loading.set(true);
    const userData = this.form.value;

    const request = this.isEditMode()
      ? this.usersApi.updateUser(this.userId()!, userData)
      : this.usersApi.createUser(userData);

    request
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/admin/users']);
        },
        error: (err) => {
          this.error.set('Failed to save user');
          this.loading.set(false);
          console.error(err);
        },
      });
  }

  onCancel() {
    this.router.navigate(['/admin/users']);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    if (control.errors['required']) return `${fieldName} is required`;
    if (control.errors['minlength']) {
      return `${fieldName} must be at least ${control.errors['minlength'].requiredLength} characters`;
    }
    if (control.errors['email']) return 'Please enter a valid email';

    return 'Invalid field';
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
