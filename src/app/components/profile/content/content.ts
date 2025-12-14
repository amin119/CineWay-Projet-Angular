import { Component, effect, EventEmitter, inject, Input, Output } from '@angular/core';
import { User } from '../../../auth/model/user';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-content',
  imports: [ReactiveFormsModule],
  templateUrl: './content.html',
  styleUrl: './content.css',
})
export class Content {
@Input() user!: User | null;
@Input() section!: 'profile' | 'preferences' | 'help';
@Output() updateProfile = new EventEmitter<Partial<User>>();
//@Output() changePassword = new EventEmitter<PasswordDto>(); NO logic change password in back 
private fb = inject(FormBuilder);

profileForm = this.fb.group({
  full_name: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
});
private formInitialized = false;

constructor() {
  effect(() => {
    if (this.user && !this.formInitialized) {
      this.profileForm.patchValue({
        full_name: this.user.full_name,
        email: this.user.email,
      });
      this.formInitialized = true;
    }
  });
}

//to fiiiiix
onSave() {
  if (this.profileForm.invalid || this.profileForm.pristine) return;

  const raw = this.profileForm.getRawValue();

  const payload: Partial<User> = {
    ...(raw.full_name ? { full_name: raw.full_name } : {}),
    ...(raw.email ? { email: raw.email } : {}),
  };

  this.updateProfile.emit(payload);
  this.profileForm.markAsPristine();
}


}
