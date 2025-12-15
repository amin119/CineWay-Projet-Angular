import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  imports: [],
})
export class Home {
  auth= inject(AuthService)
  user=this.auth.loadUser().subscribe(
  )
}
