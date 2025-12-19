import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

export interface MultiSelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-multi-select-dropdown',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './multi-select-dropdown.html',
  styleUrls: ['./multi-select-dropdown.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectDropdownComponent),
      multi: true,
    },
  ],
})
export class MultiSelectDropdownComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = 'Select items...';
  @Input() options: MultiSelectOption[] = [];
  @Input() control: any = null;
  @Input() required = false;
  @Input() showLabel = true;
  @Output() valueChange = new EventEmitter<string[]>();

  selectedValues: string[] = [];
  disabled = false;
  isOpen = false;

  onChange: (value: string[]) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string | string[]): void {
    this.selectedValues = Array.isArray(value) ? value : value ? [value] : [];
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggleDropdown(): void {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
    }
  }

  toggleOption(value: string): void {
    const index = this.selectedValues.indexOf(value);
    if (index > -1) {
      this.selectedValues.splice(index, 1);
    } else {
      this.selectedValues.push(value);
    }
    this.onChange(this.selectedValues);
    this.valueChange.emit(this.selectedValues);
  }

  removeTag(value: string, event: Event): void {
    event.stopPropagation();
    this.toggleOption(value);
  }

  isSelected(value: string): boolean {
    return this.selectedValues.includes(value);
  }

  getSelectedLabels(): string {
    return this.selectedValues
      .map(val => this.options.find(opt => opt.value === val)?.label || val)
      .join(', ');
  }

  getSelectedLabel(value: string): string {
    return this.options.find(opt => opt.value === value)?.label || value;
  }

  closeDropdown(): void {
    this.isOpen = false;
    this.onTouched();
  }
}
