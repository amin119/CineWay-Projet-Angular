
import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, finalize, map, Observable, of, switchMap, tap } from 'rxjs';

import { APP_API } from '../../config/app-api.config';
import { LoginResponseDto } from '../dto/login-response.dto';
import { LoginRequestDto } from '../dto/login-request.dto';
import { SignupRequestDto } from '../dto/signup-request.dto';
import { User } from '../model/user';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private _user = signal<User | null>(null);
  private _loading = signal(false);
  public loading = this._loading.asReadonly();
  isAuthenticated = computed(() => !!this._user());
  constructor() {
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequestDto): Observable<User | null> {
    this._loading.set(true);
    const body = new HttpParams()
      .set('username', credentials.username)
      .set('password', credentials.password);
    return this.http
      .post<LoginResponseDto>(APP_API.auth.login, body.toString(), {
        headers: { 'content-Type': 'application/x-www-form-urlencoded' },
      })
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.access_token);
        }),
        switchMap(() => this.loadUser()),
        finalize(() => this._loading.set(false))
      );
  }

  signup(data: SignupRequestDto): Observable<User> {
    this._loading.set(true);
    return this.http
      .post<User>(APP_API.auth.signup, data)
      .pipe(finalize(() => this._loading.set(false)));
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
    localStorage.removeItem('authUser');
    this._user.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private loadUser(): Observable<User | null> {
    const token = this.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<User>(APP_API.auth.me, { headers }).pipe(
        tap((user) => {
          this._user.set(user);
          const { id, ...userToSave } = user;
          localStorage.setItem('authUser', JSON.stringify(userToSave));
        })
      );
    } else {
      return of(null);
    }
  }
  private loadUserFromStorage() {
    const userData = localStorage.getItem('authUser');
    if (userData) {
      this._user.set(JSON.parse(userData));
    } else if (this.getToken()) {
      this.loadUser().subscribe();
    }
  }
  getUser() {
    return this._user.asReadonly();
  }
  user = signal<User | null>(null);



}
