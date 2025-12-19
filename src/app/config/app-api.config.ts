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

  user: {
    me:`${environment.apiUrl}/users/me`,
    preferences: `${environment.apiUrl}/users/me/preferences`,
    profilePicture: `${environment.apiUrl}/users/me/profile-picture`,
  },

  cinema:{
    list: `${environment.apiUrl}/cinemas/`,
    search :`${environment.apiUrl}/cinemas/search`
  },

  admin: {
    stats: {
      movies: `${environment.apiUrl}/admin/stats/movies`,
      cinemas: `${environment.apiUrl}/admin/stats/cinemas`,
      users: `${environment.apiUrl}/admin/stats/users`,
      recentBookings: `${environment.apiUrl}/admin/stats/bookings/recent`,
      totalTickets: `${environment.apiUrl}/admin/stats/tickets/total`,
      revenue: `${environment.apiUrl}/admin/stats/revenue`,
      today: `${environment.apiUrl}/admin/stats/today`,
    }
  }
};
