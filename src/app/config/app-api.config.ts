import { environment } from '../../environments/environment';

export const APP_API = {
  auth: {
    login: `${environment.apiUrl}/auth/login`,
    signup: `${environment.apiUrl}/auth/register`,
    logout: `${environment.apiUrl}/auth/logout`,
    checkmail: `${environment.apiUrl}/auth/check-email`,
    me : `${environment.apiUrl}/auth/me`,
  },
  movies:{
    movies: `${environment.apiUrl}/movies`,
  },
  cinema:{
    list: `${environment.apiUrl}/cinemas/`,
    search :`${environment.apiUrl}/cinemas/search`
  }
};
