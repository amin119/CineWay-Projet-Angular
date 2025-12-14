import { Routes } from '@angular/router';
import { Signup } from './auth/signup/signup';
import { Login } from './auth/login/login';
import { Home } from './components/home/home';

import { authGuard } from './auth/guards/auth.guard';
import { guestGuard } from './auth/guards/guest.guard';

import { LandingPageComponent } from './components/landingPage/landing-page-component/landing-page-component';
import { MainLayout } from './components/layouts/main-layout/main-layout';
import { Cinemas } from './components/cinemas/cinemas/cinemas';
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
        canActivate :[authGuard]
      }
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
