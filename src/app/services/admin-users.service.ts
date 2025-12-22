import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_API } from '../config/app-api.config';
import { UserModel } from '../models/user.model';

export interface CreateAdminPayload {
  email: string;
  full_name: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AdminUsersService {
  private http = inject(HttpClient);

  listUsers(skip = 0, limit = 100, status?: string, role?: string): Observable<UserModel[]> {
    let params = new HttpParams()
      .set('skip', skip)
      .set('limit', limit);

    if (status) {
      params = params.set('status', status);
    }
    if (role) {
      params = params.set('role', role);
    }

    return this.http.get<UserModel[]>(`${APP_API.user.admin}/admin/users/`, { params });
  }

  createAdmin(adminData: CreateAdminPayload): Observable<UserModel> {
    return this.http.post<UserModel>(`${APP_API.user.admin}/admin/users/`, adminData);
  }

  updateUserStatus(userId: number, isActive: boolean): Observable<UserModel> {
    return this.http.patch<UserModel>(`${APP_API.user.admin}/admin/users/${userId}/status`, {
      is_active: isActive,
    });
  }
}
