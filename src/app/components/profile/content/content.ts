import { Component, effect, EventEmitter, inject, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserApi } from '../../../services/user-api';
import { Profile } from '../../../models/profile.model';
import { ToastrService } from 'ngx-toastr';
import { ChangePasswordRequestDto } from '../../../auth/services/auth.service';

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
  @Output() uploadProfilePicture = new EventEmitter<File>();
  @Output() changePassword = new EventEmitter<ChangePasswordRequestDto>();


  profileForm = this.fb.nonNullable.group({
    full_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  passwordForm = this.fb.nonNullable.group(
    {
      current_password: ['', [Validators.required, Validators.minLength(6)]],
      new_password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_new_password: ['', [Validators.required, Validators.minLength(6)]],
    },
    { validators: [this.passwordsMatchValidator] }
  );

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

  private passwordsMatchValidator(control: AbstractControl) {
    const newPassword = control.get('new_password')?.value;
    const confirm = control.get('confirm_new_password')?.value;
    if (!newPassword || !confirm) return null;
    return newPassword === confirm ? null : { passwordMismatch: true };
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
 onPictureSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];

  this.uploadProfilePicture.emit(file);
}

  onChangePassword() {
    if (this.passwordForm.invalid) return;

    const { current_password, new_password } = this.passwordForm.getRawValue();
    this.changePassword.emit({ current_password, new_password });

    this.passwordForm.reset();
  }

}
