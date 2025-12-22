import { Component, input, output, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminUsersService, CreateAdminPayload } from '../../../../services/admin-users.service';

@Component({
  selector: 'app-add-edit-admin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1220]/60 backdrop-blur-md">
      <div class="relative w-full max-w-2xl bg-gradient-to-br from-[#1a2634] to-[#0f1724] rounded-2xl shadow-2xl border border-blue-500/20">
        <!-- Header -->
        <div class="border-b border-gray-700/50 bg-[#1a2634]/95 backdrop-blur-sm px-8 py-4 flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-white">Add New Admin</h2>
            <p class="mt-0.5 text-sm text-gray-400">Create a new administrator account</p>
          </div>
          <button
            type="button"
            (click)="onCancel()"
            class="rounded-full p-2 text-gray-400 transition-all hover:bg-red-500/20 hover:text-red-400"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form [formGroup]="adminForm" (ngSubmit)="onSubmit()" class="p-7">
          <div class="grid grid-cols-2 gap-5">
            <!-- Full Name (spans 2 cols) -->
            <div class="col-span-2">
              <label class="block text-sm font-semibold text-gray-300 mb-2">
                Full Name <span class="text-red-400">*</span>
              </label>
              <input
                type="text"
                formControlName="full_name"
                placeholder="e.g., John Administrator"
                class="w-full rounded-lg border border-gray-600 bg-[#0f1724] px-4 py-3 text-white placeholder-gray-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              @if (adminForm.get('full_name')?.touched && adminForm.get('full_name')?.errors?.['required']) {
                <p class="mt-1 text-sm text-red-400">Full name is required</p>
              }
              @if (adminForm.get('full_name')?.touched && adminForm.get('full_name')?.errors?.['minlength']) {
                <p class="mt-1 text-sm text-red-400">Name must be at least 2 characters</p>
              }
            </div>

            <!-- Email -->
            <div class="col-span-2">
              <label class="block text-sm font-semibold text-gray-300 mb-2">
                Email <span class="text-red-400">*</span>
              </label>
              <input
                type="email"
                formControlName="email"
                placeholder="admin@cinema.com"
                class="w-full rounded-lg border border-gray-600 bg-[#0f1724] px-4 py-3 text-white placeholder-gray-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              @if (adminForm.get('email')?.touched && adminForm.get('email')?.errors?.['required']) {
                <p class="mt-1 text-sm text-red-400">Email is required</p>
              }
              @if (adminForm.get('email')?.touched && adminForm.get('email')?.errors?.['email']) {
                <p class="mt-1 text-sm text-red-400">Please enter a valid email</p>
              }
            </div>

            <!-- Password -->
            <div class="col-span-2">
              <label class="block text-sm font-semibold text-gray-300 mb-2">
                Password <span class="text-red-400">*</span>
              </label>
              <input
                type="password"
                formControlName="password"
                placeholder="••••••••"
                class="w-full rounded-lg border border-gray-600 bg-[#0f1724] px-4 py-3 text-white placeholder-gray-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              @if (adminForm.get('password')?.touched && adminForm.get('password')?.errors?.['required']) {
                <p class="mt-1 text-sm text-red-400">Password is required</p>
              }
              @if (adminForm.get('password')?.touched && adminForm.get('password')?.errors?.['minlength']) {
                <p class="mt-1 text-sm text-red-400">Password must be at least 8 characters</p>
              }
            </div>
          </div>

          <!-- Error Message -->
          @if (error()) {
            <div class="rounded-lg border border-red-500/30 bg-red-500/10 p-3 mt-4">
              <p class="text-sm text-red-400">{{ error() }}</p>
            </div>
          }

          <!-- Action Buttons -->
          <div class="flex items-center justify-end gap-4 border-t border-gray-700/50 pt-5 mt-5">
            <button
              type="button"
              (click)="onCancel()"
              class="rounded-lg border border-gray-600 bg-transparent px-6 py-2.5 font-semibold text-gray-300 transition-all hover:bg-gray-700/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="adminForm.invalid || saving()"
              class="rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-2.5 font-semibold text-white shadow-lg transition-all hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ saving() ? 'Creating...' : 'Create Admin' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [],
})
export class AddEditAdminFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly adminUsersService = inject(AdminUsersService);

  save = output<void>();
  cancel = output<void>();

  saving = signal(false);
  error = signal<string | null>(null);

  adminForm: FormGroup = this.fb.group({
    full_name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit(): void {
    if (this.adminForm.invalid) return;

    this.saving.set(true);
    this.error.set(null);

    const adminData: CreateAdminPayload = {
      full_name: this.adminForm.value.full_name,
      email: this.adminForm.value.email,
      password: this.adminForm.value.password,
    };

    this.adminUsersService.createAdmin(adminData).subscribe({
      next: () => {
        this.saving.set(false);
        this.adminForm.reset();
        this.save.emit();
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err.error?.detail || 'Failed to create admin. Please try again.');
      },
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
