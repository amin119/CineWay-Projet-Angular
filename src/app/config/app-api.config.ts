import { environment } from '../../environments/environment';

export const APP_API = {
  auth: {
    login: `${environment.apiUrl}/auth/login`,
    signup: `${environment.apiUrl}/auth/register`,
    logout: `${environment.apiUrl}/auth/logout`,
    checkmail: `${environment.apiUrl}/auth/check-email`,
  },
};
