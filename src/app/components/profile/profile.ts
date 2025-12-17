import { Component, DestroyRef, effect, inject, OnInit } from '@angular/core';
import { Sidebar } from "./sidebar/sidebar";
import { Content } from "./content/content";
import { User } from '../../auth/model/user';
import { AuthService } from '../../auth/services/auth.service';
import { UserApi } from '../../services/user-api';
import { FormBuilder, Validators } from '@angular/forms';
import { Profile as ProfileModel} from '../../models/profile.model';
import { Toast, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { APP_API } from '../../config/app-api.config';
import { APP_ROUTES } from '../../config/app-routes.confg';
@Component({
  selector: 'app-profile',
  imports: [Sidebar, Content],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  APP_Routes=APP_ROUTES;
userApi=inject(UserApi)
authService=inject(AuthService)
profile = this.userApi.profile;
loading = this.userApi.loading;
section: 'profile' | 'preferences' | 'help' = 'profile';
  toastr=inject(ToastrService)
  router=inject(Router)

onUpdateProfile(event: {
  payload: Partial<ProfileModel>;
  emailChanged: boolean;
}) {
  this.userApi.updateProfile(event.payload).subscribe({
    next: () => {
      if (event.emailChanged) {
        this.toastr.info(
          'Your email has changed. Please login again.'
        );
          this.authService.logout(); 
    this.userApi.clear();   


        this.router.navigate([APP_ROUTES.login]);
      } else {
        this.toastr.success('Profile updated successfully');
      }
    },
    error: () => {
      this.toastr.error('Failed to update profile');
    },
  });
}
onUploadProfilePicture(file: File) {
  this.userApi.uploadProfilePicture(file).subscribe({
    next: () => {
      this.toastr.success('Profile picture updated');
    },
    error: () => {
      this.toastr.error('Failed to upload profile picture');
    },
  });
}

  onSectionChange(section: 'profile' | 'preferences' | 'help') {
    this.section = section;
  }

  onLogout() {
    this.userApi.clear();
    this.router.navigate([APP_ROUTES.login]);
    this.toastr.info('You have been logged out', 'Goodbye!');
    this.authService.logout();
  }



}
