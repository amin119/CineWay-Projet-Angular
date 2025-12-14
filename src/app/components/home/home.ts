import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
 auth = inject(AuthService);

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.auth.loadUser().subscribe();
    }
  }
}
