import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { APP_ROUTES } from '../../config/app-routes.confg';
import { AuthService } from '../../auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar-component',
  imports: [RouterLink],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.css',
})
export class NavbarComponent {
private authService = inject(AuthService)
private router = inject(Router);
private toastrService = inject(ToastrService);
APP_ROUTES = APP_ROUTES;

logout(){
  this.authService.logout();
  this.router.navigate(['/']);
  this.toastrService.warning('Good bye!');
}
isAuth(){
  return this.authService.isAuthenticated();
}
}
