import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableComponent } from '../table/table';
import { TableRowComponent } from '../table-row/table-row';
import { TableActionsComponent } from '../table-actions/table-actions';
import { MovieRow, MovieStatus, StatusChip } from '../../pages/admin-movies/movie-row.model';

@Component({
  selector: 'app-movie-table',
  standalone: true,
  imports: [CommonModule, TableComponent, TableRowComponent, TableActionsComponent],
  templateUrl: './movie-table.html',
  styleUrls: ['./movie-table.css'],
})
export class MovieTableComponent {
  @Input() movies: MovieRow[] = [];
  @Input() statusChips: Record<MovieStatus, StatusChip> = {
    Published: { label: 'Published', classes: '' },
    Upcoming: { label: 'Upcoming', classes: '' },
    Draft: { label: 'Draft', classes: '' },
    Archived: { label: 'Archived', classes: '' },
  };

  @Output() view = new EventEmitter<MovieRow>();
  @Output() edit = new EventEmitter<MovieRow>();
  @Output() delete = new EventEmitter<MovieRow>();

  readonly headers = [
    { label: 'Movie Title', align: 'left' as const },
    { label: 'Release Date', align: 'left' as const },
    { label: 'Status', align: 'left' as const },
    { label: 'Actions', align: 'right' as const },
  ];

  onView(movie: MovieRow) {
    this.view.emit(movie);
  }

  onEdit(movie: MovieRow) {
    this.edit.emit(movie);
  }

  onDelete(movie: MovieRow) {
    this.delete.emit(movie);
  }
}
