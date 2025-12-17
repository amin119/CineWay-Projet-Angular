import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrls: ['./pagination.css'],
})
export class PaginationComponent {
  @Input() startIndex = 0;
  @Input() endIndex = 0;
  @Input() totalCount = 0;
  @Input() page = 1;
  @Input() totalPages = 1;

  @Output() previous = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
}
