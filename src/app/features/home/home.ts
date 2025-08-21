import { Component, Inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
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
  imports: [CommonModule, HttpClientModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class HomeComponent {
  bragItems: BragItem[] = [];

  constructor(
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadBragItems();
    }
  }

  loadBragItems() {
    this.http.get('bragitems.csv', { responseType: 'text' }).subscribe(csvData => {
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
        }
      });
    });
  }
}
