import { Component, input, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CinemaService } from '../../../services/cinema.service';
import { Cinema } from '../../../models/cinema.model';
import { AMENITY_ICONS, DEFAULT_AMENITY_ICON, formatName, getIconAmenity } from '../../../config/amenities.config';

@Component({
  selector: 'app-cinema-details',
  templateUrl: './cinema-details.html',
  styleUrl: './cinema-details.css',
})
export class CinemaDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cinemaService = inject(CinemaService);

  cinema = computed(() => this.cinemaService.cinemaDetailsRes.value());
  error = computed(() => this.cinemaService.cinemaDetailsRes.error());

  isLoading = computed(() => this.cinemaService.cinemaDetailsRes.isLoading());
  amenityIcons = AMENITY_ICONS;
  defaultIcon = DEFAULT_AMENITY_ICON;

  ngOnInit() {
    const cinemaId = Number(this.route.snapshot.paramMap.get('id'));
    if (cinemaId) {
      this.cinemaService.getCinemaDetails(cinemaId);
    }
  }

  getIcon(amenity: string): string {
    return getIconAmenity(amenity);
  }

  formatAmenityName(amenity: string): string {
    return formatName(amenity);
  }
  goBack() {
    this.router.navigate(['/cinemas']);
  }
}
