import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface BragItem {
  location: string;
  date: string;
  description: string;
  image: string;
  map: string; // Use string for map HTML
  tags: string;
}

@Component({
  selector: 'app-brag-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brag-card.component.html',
  styleUrls: ['./brag-card.component.scss'],
})
export class BragCardComponent {
  @Input() bragItem!: BragItem;
  @Input() iframeVisible = false;
  @Input() primaryClass = 'bg-primary01';
  @Input() overlayClass = 'bg-overlay01';

  constructor(public sanitizer: DomSanitizer) {}

  showMap(): void {
    this.iframeVisible = true;
  }
}
