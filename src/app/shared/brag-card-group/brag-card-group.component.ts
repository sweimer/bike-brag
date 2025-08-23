import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import Papa from 'papaparse';
import { BragCardComponent, BragItem } from '../brag-card/brag-card.component';

@Component({
  selector: 'app-brag-card-group',
  standalone: true,
  imports: [CommonModule, BragCardComponent, InfiniteScrollDirective],
  templateUrl: './brag-card-group.component.html',
  styleUrls: ['./brag-card-group.component.scss'],
})
export class BragCardGroup {
  bragItems: BragItem[] = [];
  visibleCount = 1;
  loading = true;
  iframeVisible: boolean[] = [];
  visibleBragItems: BragItem[] = [];

  trackByIndex(index: number, item: BragItem): number {
    return index;
  }

  primaryClasses = [
    'bg-primary01', 'bg-primary02', 'bg-primary03',
    'bg-primary04', 'bg-primary05', 'bg-primary06'
  ];
  overlayClasses = [
    'bg-overlay01', 'bg-overlay02', 'bg-overlay03',
    'bg-overlay04', 'bg-overlay05', 'bg-overlay06'
  ];

  getPrimaryClass(index: number): string {
    return this.primaryClasses[index % this.primaryClasses.length];
  }
  getOverlayClass(index: number): string {
    return this.overlayClasses[index % this.overlayClasses.length];
  }

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadBragItems();
    }
  }

  loadBragItems() {
    const googleSheetCsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTtxIQ3CN690WZVW6GNIhNBETnwg-yCd1iutLA4MFPklh_JvFYlMZlFKYypaOfLLSMGvSjxAQRKkjQg/pub?output=csv';
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
            map: item.map,
            tags: item.tags,
          }));
          if (this.iframeVisible.length === 0) {
            this.iframeVisible = new Array(this.bragItems.length).fill(false);
          }
          this.visibleBragItems = this.bragItems.slice(0, this.visibleCount); // <-- update here
          this.loading = false;
          this.cdr.detectChanges();
          setTimeout(() => this.observeIframes(), 0);
        }
      });
    });
  }

  loadMore() {
    this.visibleCount += 1;
    this.visibleBragItems = this.bragItems.slice(0, this.visibleCount); // <-- update here
    setTimeout(() => this.observeIframes(), 0);
  }

  observeIframes() {
    if (typeof window === 'undefined') return;
    const iframes = document.querySelectorAll('.brag-iframe');
    iframes.forEach((iframe, idx) => {
      if (this.iframeVisible[idx]) return; // Already visible, skip observing
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.iframeVisible[idx] = true;
              observer.unobserve(entry.target); // Stop observing after first intersection
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
