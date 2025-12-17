import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormInputComponent } from '../form-input/form-input';

export interface CastMember {
  actor: string;
  role: string;
}

@Component({
  selector: 'app-dynamic-input-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormInputComponent],
  templateUrl: './dynamic-input-list.html',
  styleUrls: ['./dynamic-input-list.css'],
})
export class DynamicInputListComponent implements OnInit, OnChanges {
  @Input() label = '';
  @Input() items: CastMember[] = [];
  @Input() field1Label = 'Actor';
  @Input() field1Placeholder = 'e.g., Leonardo DiCaprio';
  @Input() field2Label = 'Role';
  @Input() field2Placeholder = 'e.g., Jack Dawson';
  @Input() required = false;
  @Input() showLabel = true;
  @Output() itemsChange = new EventEmitter<CastMember[]>();
  @Output() itemAdded = new EventEmitter<CastMember>();
  @Output() itemRemoved = new EventEmitter<number>();

  formGroups: FormGroup[] = [];

  ngOnInit(): void {
    this.initializeFormGroups();
  }

  ngOnChanges(): void {
    if (this.items.length !== this.formGroups.length) {
      this.initializeFormGroups();
    }
  }

  private initializeFormGroups(): void {
    this.formGroups = this.items.map(item =>
      new FormGroup({
        field1: new FormControl(item.actor || ''),
        field2: new FormControl(item.role || ''),
      })
    );
  }

  addItem(): void {
    const newItem: CastMember = { actor: '', role: '' };
    this.items = [...this.items, newItem];
    this.formGroups.push(
      new FormGroup({
        field1: new FormControl(''),
        field2: new FormControl(''),
      })
    );
    this.itemAdded.emit(newItem);
    this.itemsChange.emit(this.items);
  }

  removeItem(index: number): void {
    this.items = this.items.filter((_, i) => i !== index);
    this.formGroups.splice(index, 1);
    this.itemRemoved.emit(index);
    this.itemsChange.emit(this.items);
  }

  updateItem(index: number, field: 'actor' | 'role', value: string): void {
    this.items[index] = {
      ...this.items[index],
      [field]: value,
    };
    this.itemsChange.emit(this.items);
  }

  getFieldValue(index: number, field: 'actor' | 'role'): string {
    return field === 'actor' ? this.items[index].actor : this.items[index].role;
  }
}
