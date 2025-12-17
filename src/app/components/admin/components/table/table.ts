import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TableHeader, TableHeaderComponent } from '../table-header/table-header';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, TableHeaderComponent],
  templateUrl: './table.html',
  styleUrls: ['./table.css'],
})
export class TableComponent {
  @Input() headers: TableHeader[] = [];
}
