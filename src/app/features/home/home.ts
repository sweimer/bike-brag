import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import Papa from 'papaparse';

export interface BragItem {
  location: string;
  date: string;
  description: string;
  image: string;
  map: SafeResourceUrl;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, InfiniteScrollDirective],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})

export class HomeComponent {
  bragItems: BragItem[] = [];
  visibleCount = 1;
  loading = true;
  iframeVisible: boolean[] = [];

  constructor(
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadBragItems();
    }
  }

  get visibleBragItems() {
    return this.bragItems.slice(0, this.visibleCount);
  }

  loadBragItems() {
    const googleSheetCsvUrl = '/bragitems.csv';
    //const googleSheetCsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS4zWnq5PNRQmbtWFQ9gx9kRxbCj-EDY6go0VID_om6uhSZvqKrD2pL7fiWn-ZuA9jxFM2WoATc83KB/pub?output=csv';
    this.http.get(googleSheetCsvUrl, { responseType: 'text' }).subscribe((csvData: string) => {
      Papa.parse(csvData, {
        header: true,
        complete: (result: any) => {
          const filtered = result.data.filter((item: any) => item.location && item.location.trim() !== '');
          this.bragItems = filtered.map((item: any) => ({
            location: item.location,
            date: item.date,
            description: item.description,
            image: item.image,
            map: this.sanitizer.bypassSecurityTrustHtml(item.map), // <-- change here
            tags: item.tags,
          }));
          this.iframeVisible = new Array(this.bragItems.length).fill(false); // Initialize visibility array
          this.loading = false;
          this.cdr.detectChanges();
          setTimeout(() => this.observeIframes(), 0); // Start observing after DOM update
        }
      });
    });
  }

  loadMore() {
    this.visibleCount += 1;
    setTimeout(() => this.observeIframes(), 0); // Re-observe after more items are shown
  }

  observeIframes() {
    if (typeof window === 'undefined') return;
    const iframes = document.querySelectorAll('.brag-iframe');
    iframes.forEach((iframe, idx) => {
      if (this.iframeVisible[idx]) return; // Already visible, skip
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.iframeVisible[idx] = true;
              observer.unobserve(entry.target);
              this.cdr.detectChanges();
            }
          });
        },
        { threshold: 0.2 }
      );
      observer.observe(iframe);
    });
  }

  showMap(index: number): void {
    this.iframeVisible[index] = true;
    this.cdr.detectChanges();
  }
}
