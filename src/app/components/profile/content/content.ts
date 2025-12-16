import { Component, effect, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserApi } from '../../../services/user-api';
import { Profile } from '../../../models/profile.model';

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

  @Input() section!: 'profile' | 'preferences' | 'help';

  @Output() updateProfile = new EventEmitter<{
    payload: Partial<Profile>;
    emailChanged: boolean;
  }>();

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

    const emailChanged =
      !!currentProfile && payload.email !== currentProfile.email;

    this.updateProfile.emit({
      payload,
      emailChanged,
    });

    this.profileForm.markAsPristine();
  }
}
