import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type TableHeader = {
  label: string;
  align?: 'left' | 'center' | 'right';
};

@Component({
  selector: 'app-table-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-header.html',
  styleUrls: ['./table-header.css'],
})
export class TableHeaderComponent {
  @Input() headers: TableHeader[] = [];
}
