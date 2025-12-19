import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { formatName } from '../../../../config/amenities.config';

@Component({
  selector: 'app-amenity-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './amenity-badge.html',
  styleUrls: ['./amenity-badge.css'],
})
export class AmenityBadgeComponent {
  @Input() amenity = '';

  format(label: string): string {
    return formatName(label);
  }
}
