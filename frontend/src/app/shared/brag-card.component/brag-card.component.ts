import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import Papa from 'papaparse';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal.component/modal.component';

export interface BragItem {
  location: string;
  date: string;
  description: string;
  image: string;
  map: SafeResourceUrl;
  tags?: string;
  rider?: string;
  tips?: string;
}

@Component({
  selector: 'app-brag-card',
  standalone: true,
  imports: [CommonModule, FormsModule, InfiniteScrollDirective, ModalComponent],
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
  hideArticle: boolean[] = [];
  chatSession: { location: string; messages: string[]; threadId: string | null } = {
    location: '',
    messages: [],
    threadId: null
  };
  showChatModal = false;
  userMessage = '';

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
    if (this.filteredTag) {
      items = items.filter(item =>
        item.tags?.split(',').map(t => t.trim()).includes(this.filteredTag!)
      );
    }
    if (this.filteredRider) {
      items = items.filter(item => item.rider === this.filteredRider);
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
          const filtered = result.data.filter((item: any) => item.location?.trim());
          this.bragItems = filtered.map((item: any) => {
            let mapHtml = item.map;
            if (mapHtml?.includes('<iframe')) {
              if (!mapHtml.includes('title=')) {
                mapHtml = mapHtml.replace('<iframe', `<iframe title="Map of ${item.location}"`);
              }
              if (!mapHtml.includes('class=')) {
                mapHtml = mapHtml.replace('<iframe', `<iframe class="brag-iframe"`);
              }
              mapHtml = mapHtml.replace(/\sheight="[^"]*"/gi, ' height="100%"');
              mapHtml = mapHtml.replace(/\swidth="[^"]*"/gi, ' width="100%"');
              mapHtml = mapHtml.replace(
                '<iframe',
                `<iframe style="height:100%;width:100%;min-height:400px;max-height:700px;max-width:100%;"`
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
              tips: item.tips,
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

  openAssistantModal(location: string): void {
    this.chatSession = {
      location,
      messages: [`ASK BRAG: Hi! What would you like to know about biking in ${location}?`],
      threadId: null
    };
    this.showChatModal = true;
  }

  sendMessage(): void {
    const message = this.userMessage.trim();
    if (!message) return;

    this.chatSession.messages.push(`YOU: ${message}`);
    this.userMessage = '';

    this.askAssistant(this.chatSession.location, message).then(reply => {
      this.chatSession.messages.push(`ASK BRAG: ${reply}`);
      this.cdr.detectChanges();
    }).catch(err => {
      console.error('Assistant error:', err);
      this.chatSession.messages.push(`ASK BRAG: Sorry, something went wrong.`);
      this.cdr.detectChanges();
    });
  }

  async askAssistant(location: string, userMessage: string): Promise<string> {
    const payload = {
      question: userMessage,
      location,
      threadId: this.chatSession.threadId
    };

    try {
      const response = await fetch('/askBrag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      this.chatSession.threadId = data.threadId || null;
      return data.reply || 'Sorry, I couldn’t find anything helpful.';
    } catch (err) {
      console.error('Fetch error:', err);
      return 'Error: Assistant failed to respond.';
    }
  }
}
