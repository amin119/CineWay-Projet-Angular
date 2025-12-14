import { Component, input } from '@angular/core';
import { Cinema } from '../../../models/cinema.model';
import { AMENITY_ICONS, DEFAULT_AMENITY_ICON } from '../../../config/amenities.config';

@Component({
  selector: 'app-cinema-card',
  imports: [],
  templateUrl: './cinema-card.html',
  styleUrl: './cinema-card.css',
})
export class CinemaCard {
  cinema = input.required<Cinema>();
  amenityIcons = AMENITY_ICONS;
  defaultIcon = DEFAULT_AMENITY_ICON;

  getIcon(amenity: string): string {
    return this.amenityIcons[amenity] ?? this.defaultIcon;
  }
  formatAmenityName(amenity: string): string {
    return (amenity.replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())).toLowerCase();
  }
}
