import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TableComponent, TableHeader } from '../../components/table/table';
import { TableRowComponent } from '../../components/table-row/table-row';
import { TableActionsComponent } from '../../components/table-actions/table-actions';
import { SearchInputComponent } from '../../components/search-input/search-input';
import { FilterDropdownComponent } from '../../components/filter-dropdown/filter-dropdown';
import { PrimaryButtonComponent } from '../../components/primary-button/primary-button';
import { AmenityBadgeComponent } from '../../components/amenity-badge/amenity-badge';
import { PaginationComponent } from '../../components/pagination/pagination';
import { AddEditCinemaFormComponent } from '../../components/add-edit-cinema-form/add-edit-cinema-form';
import { Cinema } from '../../../../models/cinema.model';
import { AdminCinemaService } from '../../../../services/admin-cinema.service';

@Component({
  selector: 'app-admin-cinemas',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    TableRowComponent,
    TableActionsComponent,
    SearchInputComponent,
    FilterDropdownComponent,
    PrimaryButtonComponent,
    AmenityBadgeComponent,
    PaginationComponent,
    AddEditCinemaFormComponent,
  ],
  templateUrl: './admin-cinemas.html',
  styleUrls: ['./admin-cinemas.css'],
})
export class AdminCinemasComponent implements OnInit {
  private adminCinemaService = inject(AdminCinemaService);
  private router = inject(Router);

  readonly headers: TableHeader[] = [
    { label: 'Cinema Name', align: 'left' },
    { label: 'Address', align: 'left' },
    { label: 'Amenities', align: 'left' },
    { label: 'Actions', align: 'right' },
  ];

  private readonly pageSize = 5;

  // Signals for state management
  readonly searchTerm = signal('');
  readonly amenityFilter = signal('all');
  readonly page = signal(1);

  // Modal state
  readonly showModal = signal(false);
  readonly editingCinema = signal<Cinema | null>(null);
  readonly isEditMode = signal(false);

  // Service state
  readonly cinemas = this.adminCinemaService.cinemas;
  readonly loading = this.adminCinemaService.loading;
  readonly error = this.adminCinemaService.error;
  readonly deleting = this.adminCinemaService.deleting;

  // Computed properties for filtering and pagination
  readonly filteredCinemas = computed(() => {
    const q = this.searchTerm().toLowerCase().trim();
    const amenity = this.amenityFilter();

    return this.cinemas().filter((cinema) => {
      const matchesQuery = !q
        || cinema.name.toLowerCase().includes(q)
        || cinema.address.toLowerCase().includes(q)
        || cinema.city.toLowerCase().includes(q);

      const matchesAmenity = amenity === 'all'
        || cinema.amenities?.some((a) => a === amenity);

      return matchesQuery && matchesAmenity;
    });
  });

  readonly totalPages = computed(() => {
    const total = this.filteredCinemas().length;
    return total === 0 ? 1 : Math.ceil(total / this.pageSize);
  });

  readonly paginatedCinemas = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.filteredCinemas().slice(start, start + this.pageSize);
  });

  readonly startIndex = computed(() => {
    const hasItems = this.filteredCinemas().length > 0;
    return hasItems ? (this.page() - 1) * this.pageSize + 1 : 0;
  });

  readonly endIndex = computed(() => {
    const total = this.filteredCinemas().length;
    if (total === 0) {
      return 0;
    }
    return Math.min(this.page() * this.pageSize, total);
  });

  readonly amenityOptions = computed(() => {
    const set = new Set<string>();
    this.cinemas().forEach((cinema) => cinema.amenities?.forEach((a) => set.add(a)));
    const options = Array.from(set).sort().map((value) => ({ value, label: value }));
    return [{ value: 'all', label: 'All Amenities' }, ...options];
  });

  ngOnInit(): void {
    this.adminCinemaService.loadAll();
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
    const trimmed = term.trim();
    if (!trimmed) {
      this.adminCinemaService.loadAll();
      return;
    }

    this.adminCinemaService.search(trimmed);
  }

  onAmenityChange(value: string): void {
    this.amenityFilter.set(value);
    this.page.set(1);
  }

  previousPage(): void {
    if (this.page() > 1) {
      this.page.set(this.page() - 1);
    }
  }

  nextPage(): void {
    if (this.page() < this.totalPages()) {
      this.page.set(this.page() + 1);
    }
  }

  onAddCinema(): void {
    this.editingCinema.set(null);
    this.isEditMode.set(false);
    this.showModal.set(true);
  }

  onEdit(cinema: Cinema): void {
    this.editingCinema.set(cinema);
    this.isEditMode.set(true);
    this.showModal.set(true);
  }

  onViewShowtimes(cinema: Cinema): void {
    this.router.navigate(['/admin/showtimes'], { queryParams: { cinemaId: cinema.id } });
  }

  onDelete(cinema: Cinema): void {
    const confirmed = confirm(`Are you sure you want to delete "${cinema.name}"? This action cannot be undone.`);
    if (!confirmed) return;

    this.adminCinemaService.delete(cinema.id).subscribe({
      next: () => {
        // Cinema removed from signal, list auto-updates
      },
      error: (err) => {
        console.error('Delete failed:', err);
      },
    });
  }

  onFormSave(data: Partial<Cinema>): void {
    if (this.isEditMode() && this.editingCinema()) {
      const cinemaId = this.editingCinema()!.id;
      this.adminCinemaService.update(cinemaId, data).subscribe({
        next: () => {
          this.closeModal();
        },
        error: (err) => {
          console.error('Update failed:', err);
        },
      });
    } else {
      this.adminCinemaService.create(data).subscribe({
        next: () => {
          this.closeModal();
        },
        error: (err) => {
          console.error('Create failed:', err);
        },
      });
    }
  }

  onFormCancel(): void {
    this.closeModal();
  }

  private closeModal(): void {
    this.showModal.set(false);
    this.editingCinema.set(null);
    this.isEditMode.set(false);
  }
}

