import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUsersService } from '../../../../services/admin-users.service';
import { UserModel } from '../../../../models/user.model';
import { TableComponent, TableHeader } from '../../components/table/table';
import { TableRowComponent } from '../../components/table-row/table-row';
import { TableActionsComponent } from '../../components/table-actions/table-actions';
import { PaginationComponent } from '../../components/pagination/pagination';
import { PrimaryButtonComponent } from '../../components/primary-button/primary-button';
import { FilterDropdownComponent } from '../../components/filter-dropdown/filter-dropdown';
import { SearchInputComponent } from '../../components/search-input/search-input';
import { AddEditAdminFormComponent } from '../../components/add-edit-admin-form/add-edit-admin-form';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    TableRowComponent,
    TableActionsComponent,
    PaginationComponent,
    FilterDropdownComponent,
    SearchInputComponent,
    AddEditAdminFormComponent,
  ],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
})
export class AdminUsersComponent implements OnInit {
  private readonly adminUsersService = inject(AdminUsersService);

  headers: TableHeader[] = [
    { label: 'User Name' },
    { label: 'Email' },
    { label: 'Registration Date' },
    { label: 'Status' },
    { label: 'Role' },
    { label: 'Actions' },
  ];

  users = signal<UserModel[]>([]);
  searchQuery = signal<string>('');
  statusFilter = signal<string>('');
  roleFilter = signal<string>('');
  loading = signal(true);
  showAddAdminForm = signal(false);

  page = signal(1);
  itemsPerPage = signal(10);

  statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Suspended', value: 'suspended' },
  ];

  roleOptions = [
    { label: 'User', value: 'user' },
    { label: 'Admin', value: 'admin' },
  ];

  filteredUsers = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const status = this.statusFilter();
    const role = this.roleFilter();

    return this.users().filter((user) => {
      const matchesSearch =
        user.full_name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query);

      const matchesStatus =
        !status ||
        (status === 'active' && user.is_active) ||
        (status === 'suspended' && !user.is_active);

      const matchesRole =
        !role || (role === 'admin' && user.is_admin) || (role === 'user' && !user.is_admin);

      return matchesSearch && matchesStatus && matchesRole;
    });
  });

  totalPages = computed(() => Math.ceil(this.filteredUsers().length / this.itemsPerPage()));

  paginatedUsers = computed(() => {
    const start = (this.page() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.filteredUsers().slice(start, end);
  });

  startIndex = computed(() => (this.page() - 1) * this.itemsPerPage() + 1);
  endIndex = computed(() => Math.min(this.page() * this.itemsPerPage(), this.filteredUsers().length));

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.adminUsersService.listUsers(0, 100).subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load users:', err);
        this.loading.set(false);
      },
    });
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.page.set(1);
  }

  openAddAdminForm(): void {
    this.showAddAdminForm.set(true);
  }

  onAdminCreated(): void {
    this.showAddAdminForm.set(false);
    this.loadUsers();
  }

  onEditUser(user: UserModel): void {
    console.log('Edit user:', user);
  }

  onSuspendUser(user: UserModel): void {
    const newStatus = !user.is_active;
    const action = newStatus ? 'activate' : 'suspend';
    const confirmed = confirm(`Are you sure you want to ${action} this user?`);

    if (confirmed) {
      this.adminUsersService.updateUserStatus(user.id, newStatus).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (err) => {
          console.error('Failed to update user status:', err);
        },
      });
    }
  }

  previousPage(): void {
    if (this.page() > 1) {
      this.page.update((p) => p - 1);
    }
  }

  nextPage(): void {
    if (this.page() < this.totalPages()) {
      this.page.update((p) => p + 1);
    }
  }
}

