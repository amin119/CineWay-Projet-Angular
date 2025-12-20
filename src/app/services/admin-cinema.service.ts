import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, finalize, of, tap } from 'rxjs';
import { APP_API } from '../config/app-api.config';
import { Cinema } from '../models/cinema.model';

@Injectable({ providedIn: 'root' })
export class AdminCinemaService {
  private http = inject(HttpClient);

  private _cinemas = signal<Cinema[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);
  private _deleting = signal<number | null>(null);

  readonly cinemas = this._cinemas.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly deleting = this._deleting.asReadonly();

  loadAll(limit = 200, skip = 0): void {
    const params = new HttpParams().set('limit', limit).set('skip', skip);
    this.fetchCinemas(this.http.get<Cinema[]>(APP_API.cinema.list, { params }));
  }

  search(query: string): void {
    const q = query.trim();
    if (!q) {
      this.loadAll();
      return;
    }

    const params = new HttpParams().set('q', q);
    this.fetchCinemas(this.http.get<Cinema[]>(`${APP_API.cinema.search}`, { params }));
  }

  getSingleCinema(cinemaId: number): Observable<Cinema> {
    return this.http.get<Cinema>(`${APP_API.cinema.list}${cinemaId}`).pipe(
      catchError((err) => {
        const detail = err?.error?.detail ?? 'Unable to load cinema.';
        this._error.set(detail);
        throw err;
      })
    );
  }

  create(cinema: Partial<Cinema>): Observable<Cinema> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.post<Cinema>(APP_API.cinema.list, cinema).pipe(
      tap((newCinema) => {
        this._cinemas.set([newCinema, ...this._cinemas()]);
      }),
      catchError((err) => {
        const detail = err?.error?.detail ?? 'Failed to create cinema.';
        this._error.set(detail);
        throw err;
      }),
      finalize(() => this._loading.set(false))
    );
  }

  update(cinemaId: number, cinema: Partial<Cinema>): Observable<Cinema> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.patch<Cinema>(`${APP_API.cinema.list}${cinemaId}`, cinema).pipe(
      tap((updatedCinema) => {
        this._cinemas.set(
          this._cinemas().map((c) => (c.id === cinemaId ? updatedCinema : c))
        );
      }),
      catchError((err) => {
        const detail = err?.error?.detail ?? 'Failed to update cinema.';
        this._error.set(detail);
        throw err;
      }),
      finalize(() => this._loading.set(false))
    );
  }

  delete(cinemaId: number): Observable<void> {
    this._deleting.set(cinemaId);
    this._error.set(null);

    return this.http.delete<void>(`${APP_API.cinema.list}${cinemaId}`).pipe(
      tap(() => {
        this._cinemas.set(this._cinemas().filter((c) => c.id !== cinemaId));
      }),
      catchError((err) => {
        const detail = err?.error?.detail ?? 'Failed to delete cinema.';
        this._error.set(detail);
        throw err;
      }),
      finalize(() => this._deleting.set(null))
    );
  }

  getCinemas(): Observable<Cinema[]> {
    return this.http.get<Cinema[]>(APP_API.cinema.list);
  }

  getCinemaRooms(cinemaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${APP_API.cinema.list}${cinemaId}/rooms/`);
  }

  private fetchCinemas(request$: Observable<Cinema[]>): void {
    this._loading.set(true);
    this._error.set(null);

    (request$ as any)
      .pipe(
        tap((cinemas: Cinema[]) => this._cinemas.set(cinemas ?? [])),
        catchError((err) => {
          const detail = err?.error?.detail ?? 'Unable to load cinemas.';
          this._cinemas.set([]);
          this._error.set(detail);
          return of([]);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe();
  }
}

