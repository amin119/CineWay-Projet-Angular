import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export type FilterOption = { value: string; label: string };

@Component({
  selector: 'app-filter-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-dropdown.html',
  styleUrls: ['./filter-dropdown.css'],
})
export class FilterDropdownComponent {
  @Input() label = '';
  @Input() value = '';
  @Input() options: FilterOption[] = [];
  @Output() valueChange = new EventEmitter<string>();

  onChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.valueChange.emit(target.value);
  }
}
