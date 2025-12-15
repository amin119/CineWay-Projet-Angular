import { Component } from '@angular/core';
import { StatsCard } from '../../components/stats-card/stats-card';
import { QuickNavCard } from '../../components/quick-nav-card/quick-nav-card';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [StatsCard, QuickNavCard],
  templateUrl: './admin-overview.html',
  styleUrls: ['./admin-overview.css'],
})
export class AdminOverviewComponent {
  totalMovies = 1254;
  totalCinemas = 87;
  recentBookings = 3492;
  newUserSignups = 673;
}
