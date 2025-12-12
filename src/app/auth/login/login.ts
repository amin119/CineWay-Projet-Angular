import { Component, inject } from '@angular/core';
import { APP_ROUTES } from '../../config/app-routes.confg';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginResponseDto } from '../dto/login-response.dto';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  APP_ROUTES = APP_ROUTES;

  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private formBuilder = inject(NonNullableFormBuilder);

  loginForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.getRawValue();

      this.authService.login(loginData).subscribe({
        next: (res : LoginResponseDto) => {
          localStorage.setItem('token',res.access_token)
          this.toastr.success(`Welcome back`); //to add logic to get user name with the response
          this.router.navigate([APP_ROUTES.home]);
        },
        error: (err) => {
          this.toastr.error('Email or password is incorrect.');
        },
      });
    }
  }
}
