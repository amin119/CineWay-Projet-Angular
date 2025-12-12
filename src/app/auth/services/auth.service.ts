import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { APP_API } from '../../config/app-api.config';
import { LoginResponseDto } from '../dto/login-response.dto';
import { LoginRequestDto } from '../dto/login-request.dto';
import { SignupRequestDto } from '../dto/signup-request.dto';
import { User } from '../model/user';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  login(credentials: LoginRequestDto): Observable<LoginResponseDto> {
      const body = new HttpParams()
        .set('username', credentials.username)
        .set('password', credentials.password);

      return this.http.post<LoginResponseDto>(
        APP_API.auth.login,
        body.toString(),
        {
        headers: { 'content-Type': 'application/x-www-form-urlencoded' },
        }
      );
  }
  signup(data: SignupRequestDto): Observable<User> {
    return this.http.post<User>(APP_API.auth.signup, data);
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }
  checkEmailExists(email: string): Observable<boolean> {
    if (!email) {
      return of(false);
    }
    return this.http
      .get<{ exists: boolean }>(`${APP_API.auth.checkmail}?email=${encodeURIComponent(email)}`)
      .pipe(map((response) => response.exists));
  }

  logout() {
    localStorage.removeItem('token');
  }
}
