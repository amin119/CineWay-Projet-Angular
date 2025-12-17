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

   private _user = signal<User | null>(null);
  private _loading = signal(false);
  private _error = signal<any>(null);

  user = this._user.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();

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
     constructor() {
    this.loadUser().subscribe();
  }

loadUser(): Observable<User> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.get<User>(APP_API.user.me).pipe(
      tap((user) => {
        this._user.set(user);
      }),
      catchError((error) => {
        this._error.set(error);
        this._user.set(null);
        return throwError(() => error);
      }),
      finalize(() => {
        this._loading.set(false);
      })
    );
  }
  reload(): void {
    this.loadUser().subscribe();
  }
  updateProfile(payload: Partial<Profile>): Observable<User> {

    return this.http.put<User>(APP_API.user.me, payload).pipe(
      tap((updatedUser) => {
        if ( payload.email !== undefined) {
          this._user.set(updatedUser);
        }
      })
    
  );
}

updatePreferences(payload: {
    dark_mode?: boolean;
    notifications_enabled?: boolean;
    newsletter_subscribed?: boolean;
  }): Observable<User> {
    return this.http.put<User>(APP_API.user.preferences, payload).pipe(
      tap((updatedUser) => {
        this._user.set(updatedUser);
      })
    );
  }
  uploadProfilePicture(file: File): Observable<User> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.put<User>(APP_API.user.profilePicture, formData).pipe(
      tap((updatedUser) => {
        this.reload()
      })
    );
  }
  clear(): void {
    this._user.set(null);
    this._error.set(null);
    this._loading.set(false);
  }
  
}
