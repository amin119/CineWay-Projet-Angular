import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Cinema } from '../../../models/cinema.model';
import { formatName, getIconAmenity } from '../../../config/amenities.config';
import { RouterLink } from "@angular/router";
import { APP_ROUTES } from '../../../config/app-routes.confg';

@Component({
  selector: 'app-cinema-card',
  imports: [RouterLink],
  templateUrl: './cinema-card.html',
  styleUrl: './cinema-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CinemaCard {
  route = APP_ROUTES.cinemas;
  cinema = input.required<Cinema>();
  getIcon(amenity: string): string {
    return getIconAmenity(amenity);
  }
  formatAmenityName(amenity: string): string {
    return formatName(amenity);
  }
}
