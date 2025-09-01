import { Component } from '@angular/core';

@Component({
  selector: 'app-return-to-top',
  standalone: true,
  templateUrl: './return-to-top.component.html',
  styleUrl: './return-to-top.component.scss',
})
export class ReturnToTopComponent {
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
