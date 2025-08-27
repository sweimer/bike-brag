import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/header/header.component';
import { BragStart } from './shared/brag-start/brag-start.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, HeaderComponent, BragStart],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  showReturnToTop = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.onWindowScroll.bind(this));
    }
  }

  ngOnDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.onWindowScroll.bind(this));
    }
  }

  onWindowScroll() {
    if (typeof window !== 'undefined') {
      this.showReturnToTop = window.pageYOffset > 300;
      console.log('Scroll position:', window.pageYOffset, 'Show button:', this.showReturnToTop);
      this.cdr.markForCheck();
    }
  }

  scrollToTop() {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
