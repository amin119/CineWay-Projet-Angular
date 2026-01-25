import { Routes } from '@angular/router';
import { Signup } from './auth/signup/signup';
import { Login } from './auth/login/login';
import { Explore } from './components/explore/explore';
import { LandingPageComponent } from './components/landingPage/landing-page-component/landing-page-component';
import { MainLayout } from './components/layouts/main-layout/main-layout';
import { Cinemas } from './components/cinemas/cinemas/cinemas';
import { CinemaDetails } from './components/cinemas/cinema-details/cinema-details';
import { Profile } from './components/profile/profile';
import { AdminLayoutComponent } from './components/admin/layouts/admin-layout/admin-layout';
import { AdminOverviewComponent } from './components/admin/pages/admin-overview/admin-overview';
import { AdminMoviesComponent } from './components/admin/pages/admin-movies/admin-movies';
import { AddEditMoviePageComponent } from './components/admin/pages/add-edit-movie-page/add-edit-movie-page';
import { AddEditCinemaPageComponent } from './components/admin/pages/add-edit-cinema-page/add-edit-cinema-page';
import { AddEditUserPageComponent } from './components/admin/pages/add-edit-user-page/add-edit-user-page';
import { AddEditShowtimePageComponent } from './components/admin/pages/add-edit-showtime-page/add-edit-showtime-page';
import { AdminCinemasComponent } from './components/admin/pages/admin-cinemas/admin-cinemas';
import { AdminUsersComponent } from './components/admin/pages/admin-users/admin-users';
import { AdminShowtimesComponent } from './components/admin/pages/admin-showtimes/admin-showtimes';
import { authGuard } from './auth/guards/auth.guard';
import { guestGuard } from './auth/guards/guest.guard';
import { adminGuard } from './auth/guards/admin/admin.guard';
import { NotFound } from './components/not-found/not-found';
import { MovieDetails } from './components/movies/movie-details/movie-details';
import { ShowtimeSelectionComponent } from './components/movies/showtime-selection/showtime-selection';
import { MovieShowtimesComponent } from './components/movies/movie-showtimes/movie-showtimes';
import { SeatSelection } from './components/seat-selection/seat-selection';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: LandingPageComponent },
      { path: 'explore', component: Explore },
      { path: 'cinemas', component: Cinemas },
      { path: 'cinemas/:id', component: CinemaDetails },
      { path: 'profile', component: Profile },
      { path: 'not-found', component: NotFound },
      { path: 'movies/:id', component: MovieDetails },
      { path: 'movies/:id/showtimes', component: MovieShowtimesComponent },
      { path: 'screenings/:id', component: ShowtimeSelectionComponent },
      { path: 'seats/:id', component: SeatSelection },
    ],
  },
  {
    path: '',
    canActivate: [guestGuard],
    children: [
      { path: '', component: LandingPageComponent },
      { path: 'auth/login', component: Login },
      { path: 'auth/signup', component: Signup },
      {
        path: 'home',
        component: Explore,
        canActivate: [authGuard],
      },
      {
        path: '',
        component: LandingPageComponent,
        canActivate: [guestGuard],
      },
      {
        path: 'cinemas',
        component: Cinemas,
        canActivate: [authGuard],
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
      },
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: AdminOverviewComponent },
      { path: 'movies', component: AdminMoviesComponent },
      { path: 'movies/add', component: AddEditMoviePageComponent },
      { path: 'movies/edit/:id', component: AddEditMoviePageComponent },
      { path: 'cinemas', component: AdminCinemasComponent },
      { path: 'cinemas/add', component: AddEditCinemaPageComponent },
      { path: 'cinemas/edit/:id', component: AddEditCinemaPageComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'users/add', component: AddEditUserPageComponent },
      { path: 'users/edit/:id', component: AddEditUserPageComponent },
      { path: 'showtimes', component: AdminShowtimesComponent },
      { path: 'showtimes/add', component: AddEditShowtimePageComponent },
      { path: 'showtimes/edit/:id', component: AddEditShowtimePageComponent },
    ],
  },
  {
    path: '**',
    redirectTo: '/not-found',
  },
];
