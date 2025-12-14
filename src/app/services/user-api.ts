import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { User } from '../auth/model/user';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { APP_API } from '../config/app-api.config';

@Injectable({
  providedIn: 'root',
})
export class UserApi {

    private http = inject(HttpClient);
  private authService = inject(AuthService);

  //to fiiiiix
  updateProfile(data: Partial<User>): Observable<User> {
    const previousUser = this.authService.getUser()();

    if (previousUser) {
      this.authService['_user'].set({ ...previousUser, ...data });
    }

    return this.http.put<User>(APP_API.auth.me, data).pipe(
      tap((updatedUser) => {
        this.authService['_user'].set(updatedUser);
        const { id, ...userToSave } = updatedUser;
        localStorage.setItem('authUser', JSON.stringify(userToSave));
      }),
      catchError((error) => {
        if (previousUser) {
          this.authService['_user'].set(previousUser);
        }
        return throwError(() => error);
      })
    );
  }

    updateProfilePicture(file: File): Observable<User> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<User>(APP_API.auth.me, formData).pipe(
      tap((updatedUser) => {
        this.authService['_user'].set(updatedUser);
        const { id, ...userToSave } = updatedUser;
        localStorage.setItem('authUser', JSON.stringify(userToSave));
      })
    );
  }

 ////endpoint back manquante
 /* changePassword(data: {
    current_password: string;
    new_password: string;
  }): Observable<void> {
    return this.http.post<void>(APP_API., data);
  }*/
  
}
