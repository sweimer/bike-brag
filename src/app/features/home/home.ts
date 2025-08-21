import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Papa from 'papaparse';

export interface BragItem {
  location: string;
  date: string;
  description: string;
  image: string;
  map: SafeResourceUrl;
}

import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class HomeComponent {
  bragItems: BragItem[] = [];

  constructor(private sanitizer: DomSanitizer, private http: HttpClient) {
    this.loadBragItems();
  }

  loadBragItems() {
    this.http.get('assets/bragitems.csv', { responseType: 'text' }).subscribe(csvData => {
      Papa.parse(csvData, {
        header: true,
        complete: (result: any) => {
          // Filter out empty rows
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
