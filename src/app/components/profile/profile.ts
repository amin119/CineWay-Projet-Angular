import { Component, effect, inject } from '@angular/core';
import { Sidebar } from "./sidebar/sidebar";
import { Content } from "./content/content";
import { User } from '../../auth/model/user';
import { AuthService } from '../../auth/services/auth.service';
import { UserApi } from '../../services/user-api';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [Sidebar, Content],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
userService=inject(UserApi)
authService=inject(AuthService)
user=this.authService.getUser()
section: 'profile' | 'preferences' | 'help' = 'profile';


onUpdateProfile(payload: Partial<User>) {
    this.userService.updateProfile(payload).subscribe();
  }

  onLogout() {
    this.authService.logout();
  }

onSectionChange(section: 'profile' | 'preferences' | 'help') {
  this.section = section;
}

}
