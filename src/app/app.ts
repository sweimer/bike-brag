import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/header.component/header.component';
import { BragStartComponent } from './shared/brag-start.component/brag-start.component';
import { BragCardComponent } from './shared/brag-card.component/brag-card.component';
import { ReturnToTopComponent } from './shared/return-to-top.component/return-to-top.component';
import { FooterComponent } from './shared/footer.component/footer.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    HeaderComponent,
    BragStartComponent,
    BragCardComponent,
    ReturnToTopComponent,
    FooterComponent
  ],
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
