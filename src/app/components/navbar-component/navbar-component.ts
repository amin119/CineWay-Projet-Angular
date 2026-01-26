import { Component, inject, signal, HostListener, ElementRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { APP_ROUTES } from '../../config/app-routes.confg';
import { AuthService } from '../../auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../auth/model/user';
import { UserApi } from '../../services/user-api';

@Component({
  selector: 'app-navbar-component',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.css',
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastrService = inject(ToastrService);
  private elementRef = inject(ElementRef);
  APP_ROUTES = APP_ROUTES;
  menuOpen = false;
  userApi = inject(UserApi);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.menuOpen = false;
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    this.toastrService.warning('Good bye!');
  }
  isAuth() {
    return this.authService.isAuthenticated();
  }
  user = this.userApi.user;
}
