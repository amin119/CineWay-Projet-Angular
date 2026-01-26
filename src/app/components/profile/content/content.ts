import { Component, effect, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserApi } from '../../../services/user-api';
import { Profile } from '../../../models/profile.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-content',
  imports: [ReactiveFormsModule],
  templateUrl: './content.html',
  styleUrl: './content.css',
})
export class Content {
  private fb = inject(FormBuilder);
  private userApi = inject(UserApi);

  profile = this.userApi.profile;

  @Input() section!: 'profile' | 'preferences' | 'payment' | 'history' | 'help';

  @Output() updateProfile = new EventEmitter<{
    payload: Partial<Profile>;
    emailChanged: boolean;
  }>();
  @Output() uploadProfilePicture = new EventEmitter<File>();

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  profileForm = this.fb.nonNullable.group({
    full_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  constructor() {
    effect(() => {
      const p = this.profile();
      if (!p) return;

      this.profileForm.patchValue({
        full_name: p.full_name,
        email: p.email,
      });
    });
  }

  onSave() {
    if (this.profileForm.invalid || this.profileForm.pristine) return;

    const payload = this.profileForm.getRawValue();
    const currentProfile = this.profile();

    const emailChanged = !!currentProfile && payload.email !== currentProfile.email;

    this.updateProfile.emit({
      payload,
      emailChanged,
    });

    this.profileForm.markAsPristine();
  }
  onPictureSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    this.selectedFile = file;

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Reset the input
    input.value = '';
  }

  onUploadPicture() {
    if (this.selectedFile) {
      this.uploadProfilePicture.emit(this.selectedFile);
      this.selectedFile = null;
      this.previewUrl = null;
    }
  }
}
