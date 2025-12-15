import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-quick-nav-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './quick-nav-card.html',
  styleUrls: ['./quick-nav-card.css'],
})
export class QuickNavCard {
  @Input() title!: string;
  @Input() description!: string;
  @Input() linkText!: string;
  @Input() linkRoute!: string;
  @Input() icon = '';
}
