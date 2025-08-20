import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
// import { provideHttpClient, withFetch, HttpClient } from '@angular/common/http';
import { BragCard } from '../../shared/brag-card/brag-card';

@Component({
  selector: 'bragboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BragCard],
  templateUrl: './bragboard.html',
  styleUrls: ['./bragboard.scss'],
})
export class BragBoard {
  bragForm: FormGroup;
  brags: Array<{ id: number; title: string; description: string; createdAt?: Date }> = [];

  constructor(private fb: FormBuilder) {
    this.bragForm = this.fb.group({
      title: [''],
      description: [''],
    });

    // Load brags from localStorage or use defaults (browser only)
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedBrags = window.localStorage.getItem('brags');
      if (savedBrags) {
        this.brags = JSON.parse(savedBrags);
      } else {
        this.brags = [
          {
            id: 1,
            title: '20-mile ride before sunrise',
            description: 'Felt strong, no stops, and beat my previous time by 10 minutes.',
          },
          {
            id: 2,
            title: 'Solved a gnarly Tailwind + Angular build bug',
            description: 'CLI config now compiles cleanly with PostCSS and SSR.',
          },
          {
            id: 3,
            title: 'Migrated legacy site to Vercel',
            description: 'CI/CD pipeline now deploys in under 30 seconds.',
          },
        ];
      }
    } else {
      // SSR or non-browser: use defaults only
      this.brags = [
        {
          id: 1,
          title: '20-mile ride before sunrise',
          description: 'Felt strong, no stops, and beat my previous time by 10 minutes.',
        },
        {
          id: 2,
          title: 'Solved a gnarly Tailwind + Angular build bug',
          description: 'CLI config now compiles cleanly with PostCSS and SSR.',
        },
        {
          id: 3,
          title: 'Migrated legacy site to Vercel',
          description: 'CI/CD pipeline now deploys in under 30 seconds.',
        },
      ];
    }
  }

  submitBrag() {
    const newBrag = {
      id: this.brags.length + 1,
      title: this.bragForm.value.title,
      description: this.bragForm.value.description,
      createdAt: new Date(),
    };

    // Save locally in brags array
    this.brags.unshift(newBrag);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('brags', JSON.stringify(this.brags));
    }
    this.bragForm.reset();
  }

  trackById(index: number, brag: { id: number }) {
    return brag.id;
  }
}
