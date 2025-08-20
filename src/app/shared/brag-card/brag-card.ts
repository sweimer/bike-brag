import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Brag } from './brag.model';

@Component({
  selector: 'brag-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brag-card.html',
  styleUrls: ['./brag-card.scss'],
})
export class BragCard {
  @Input() id!: string;
  @Input() title!: string;
  @Input() description = '';
  @Input() createdAt!: number;
  @Input() brag!: Brag;
}
