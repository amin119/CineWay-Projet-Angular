import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type TableHeader = {
  label: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
};

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.html',
  styleUrls: ['./table.css'],
})
export class TableComponent {
  @Input() headers: TableHeader[] = [];
}
