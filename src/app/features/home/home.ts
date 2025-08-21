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
    this.http.get('bragitems.csv', { responseType: 'text' }).subscribe((csvData: string) => {
      Papa.parse(csvData, {
        header: true,
        complete: (result: any) => {
          const filtered = result.data.filter((item: any) => item.location && item.location.trim() !== '');
          this.bragItems = filtered.map((item: any) => ({
            location: item.location,
            date: item.date,
            description: item.description,
            image: item.image,
            map: this.sanitizer.bypassSecurityTrustResourceUrl(item.map),
          }));
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    });
  }

  loadMore() {
    this.visibleCount += 1;
  }
}
