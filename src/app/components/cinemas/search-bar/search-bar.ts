import { Component, inject, Output, signal, WritableSignal } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Cinema } from '../../../models/cinema.model';
import { APP_ROUTES } from '../../../config/app-routes.confg';
import { CinemaService } from '../../../services/cinema.service';
import { Router } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  formBuilder = inject(FormBuilder);
  cinemaService = inject(CinemaService);
  router = inject(Router);
  @Output() searchResult: Cinema[] = [];
  form = this.formBuilder.group({ search: [''] });
  get search(): AbstractControl {
    return this.form.get('search')!;
  }

}
