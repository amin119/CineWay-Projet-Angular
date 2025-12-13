import { Routes } from '@angular/router';
import { Signup } from './auth/signup/signup';
import { Login } from './auth/login/login';
import { Home } from './components/home/home';
import { AuthGuard } from './auth/guards/auth.guard';
import { LandingPageComponent } from './components/landingPage/landing-page-component/landing-page-component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
   
  },
  {
    path: '',
    component: Home,
    canActivate: [AuthGuard]
  },
  {
    path: 'auth',
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
