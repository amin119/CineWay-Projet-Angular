import { HttpClient, httpResource } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { User } from '../auth/model/user';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { APP_API } from '../config/app-api.config';
import { Profile } from '../models/profile.model';

@Injectable({
  providedIn: 'root',
})
export class UserApi {

    private http = inject(HttpClient);

  private userResource = httpResource<User>(() => ({
    url: APP_API.user.me,
  }));

  loading = this.userResource.isLoading;
  error = this.userResource.error;
  user = computed(() => this.userResource.value());

   profile = computed<Profile | null>(() => {
    const u = this.user();
    if (!u) return null;

    return {
      email: u.email,
      full_name: u.full_name,
      is_admin:u.is_admin,
      profile_picture_url: u.profile_picture_url ?? null,
      dark_mode: u.dark_mode,
      notifications_enabled: u.notifications_enabled,
      newsletter_subscribed: u.newsletter_subscribed,
    };
  });
    isReady = computed(() => !!this.user());
    constructor() {}



   updateProfile(payload: Partial<Profile>) {
  const isEmailChange = 'email' in payload;

  return this.http.put(APP_API.user.me, payload).pipe(
    tap(() => {
      if (!isEmailChange) {
        
        this.userResource.reload();
      }
    })
  );
}

updatePreferences(payload: {
  dark_mode?: boolean;
  notifications_enabled?: boolean;
  newsletter_subscribed?: boolean;
}) {
  return this.http.put(APP_API.user.preferences, payload);
}
uploadProfilePicture(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  return this.http.put(APP_API.user.profilePicture, formData);
}
clear(){
    this.userResource.set(undefined);

}
  
}
