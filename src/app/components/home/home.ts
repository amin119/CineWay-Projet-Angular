import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  imports: [RouterLink],
})
export class Home {
  auth= inject(AuthService)

}
