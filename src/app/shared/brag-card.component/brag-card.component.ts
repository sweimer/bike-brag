import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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
  tags?: string;
  rider?: string;
}

@Component({
  selector: 'app-brag-card',
  standalone: true,
  imports: [CommonModule, InfiniteScrollDirective],
  templateUrl: './brag-card.component.html',
  styleUrl: './brag-card.component.scss',
})
export class BragCardComponent {
  bragItems: BragItem[] = [];
  visibleCount = 1;
  loading = true;
  iframeVisible: boolean[] = [];
  filteredTag: string | null = null;
  filteredRider: string | null = null;
  hideArticle: boolean[] = []; // <-- Add this line

  constructor(
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadBragItems();
    }
  }

  get visibleBragItems() {
    let items = this.bragItems.slice(0, this.visibleCount);
    if (typeof this.filteredTag === 'string' && this.filteredTag) {
      const tag = this.filteredTag as string;
      items = items.filter(
        (item) =>
          item.tags &&
          item.tags
            .split(',')
            .map((t) => t.trim())
            .includes(tag),
      );
    }
    if (this.filteredRider) {
      items = items.filter((item) => item.rider === this.filteredRider);
    }
    return items;
  }

  loadBragItems() {
  const googleSheetCsvUrl =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTtxIQ3CN690WZVW6GNIhNBETnwg-yCd1iutLA4MFPklh_JvFYlMZlFKYypaOfLLSMGvSjxAQRKkjQg/pub?output=csv';
  this.http.get(googleSheetCsvUrl, { responseType: 'text' }).subscribe((csvData: string) => {
    Papa.parse(csvData, {
      header: true,
      complete: (result: any) => {
        const filtered = result.data.filter(
          (item: any) => item.location && item.location.trim() !== '',
        );
        this.bragItems = filtered.map((item: any) => {
          let mapHtml = item.map;
          // Add title if it's an iframe and doesn't already have one
          if (mapHtml && mapHtml.includes('<iframe') && !mapHtml.includes('title=')) {
            mapHtml = mapHtml.replace(
              '<iframe',
              `<iframe title="Map of bike route in ${item.location}"`
            );
          }
          return {
            location: item.location,
            date: item.date,
            description: item.description,
            image: item.image,
            map: this.sanitizer.bypassSecurityTrustHtml(mapHtml),
            tags: item.tags,
            rider: item.rider,
          };
        });
        this.iframeVisible = new Array(this.bragItems.length).fill(false);
        this.hideArticle = new Array(this.bragItems.length).fill(false);
        this.loading = false;
        this.cdr.detectChanges();
        setTimeout(() => this.observeIframes(), 0);
      },
    });
  });
}

  loadMore() {
    this.visibleCount += 1;
    setTimeout(() => this.observeIframes(), 0);
  }

  observeIframes() {
    if (typeof window === 'undefined') return;
    const iframes = document.querySelectorAll('.brag-iframe');
    iframes.forEach((iframe, idx) => {
      if (this.iframeVisible[idx]) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.iframeVisible[idx] = true;
              observer.unobserve(entry.target);
              this.cdr.detectChanges();
            }
          });
        },
        { threshold: 0.2 },
      );
      observer.observe(iframe);
    });
  }

  showMap(index: number): void {
    this.iframeVisible[index] = true;
    this.cdr.detectChanges();
  }

  filterByTag(tag: string) {
    this.filteredTag = tag;
  }

  filterByRider(rider: string) {
    this.filteredRider = rider;
  }

  toggleArticle(index: number) {
    this.hideArticle[index] = !this.hideArticle[index];
  }
}
