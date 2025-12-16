import { Routes } from '@angular/router';
import { Signup } from './auth/signup/signup';
import { Login } from './auth/login/login';
import { Home } from './components/home/home';

import { authGuard } from './auth/guards/auth.guard';
import { guestGuard } from './auth/guards/guest.guard';
import { adminGuard } from './auth/guards/admin/admin.guard';

import { LandingPageComponent } from './components/landingPage/landing-page-component/landing-page-component';
import { MainLayout } from './components/layouts/main-layout/main-layout';
import { Cinemas } from './components/cinemas/cinemas/cinemas';
import { CinemaDetails } from './components/cinemas/cinema-details/cinema-details';
import { Profile } from './components/profile/profile';

import { AdminLayoutComponent } from './components/admin/layouts/admin-layout/admin-layout';
import { AdminOverviewComponent } from './components/admin/pages/admin-overview/admin-overview';
import { AdminMoviesComponent } from './components/admin/pages/admin-movies/admin-movies';
import { AdminCinemasComponent } from './components/admin/pages/admin-cinemas/admin-cinemas';
import { AdminUsersComponent } from './components/admin/pages/admin-users/admin-users';
import { AdminShowtimesComponent } from './components/admin/pages/admin-showtimes/admin-showtimes';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'home',
        component: Home,
        canActivate: [authGuard],
      },
      {
        path: '',
        component: LandingPageComponent,
        canActivate : [guestGuard]
      },
      {
        path: 'cinemas',
        component : Cinemas,
        canActivate :[authGuard],
      },
      {
        path: 'cinemas/:id',
        component: CinemaDetails,
        canActivate: [authGuard],
      },
      {
        path: 'profile',
        component: Profile,
        canActivate: [authGuard],
      }
    ],
  },

  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      {
        path: 'overview',
        component: AdminOverviewComponent,
      },
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'movies',
        component: AdminMoviesComponent,
      },
      {
        path: 'cinemas',
        component: AdminCinemasComponent,
      },
      {
        path: 'users',
        component: AdminUsersComponent,
      },
      {
        path: 'showtimes',
        component: AdminShowtimesComponent,
      },
    ],
  },

  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      {
        path: 'home',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: Login,
      },
      {
        path: 'signup',
        component: Signup,
      },
    ],
  },
];
