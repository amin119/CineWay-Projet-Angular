import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-card.html',
  styleUrls: ['./stats-card.css'],
})
export class StatsCard {
  @Input() title!: string;
  @Input() value!: string | number;
  @Input() iconPath = '';
  @Input() iconBg = 'bg-blue-500/15';
  @Input() iconColor = 'text-blue-400';
}
