import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Brag } from './brag.model';

@Injectable({ providedIn: 'root' })
export class BragService {
  private csvUrl =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQcCfTm4klfjTJSHXj7mNUnO1rjj328CZ0_18ia7FR1TD4j7wRZV5wL1mjhF6WrleiJJAor2226hgeP/pub?gid=0&single=true&output=csv';

  constructor(private http: HttpClient) {}

  getBrags(): Observable<Brag[]> {
    console.log('getBrags() called');
    return this.http.get(this.csvUrl, { responseType: 'text' }).pipe(
      map((csv) => {
        const rows = csv
          .split('\n')
          .slice(1)
          .filter((row) => row.trim().length > 0);
        console.log('Fetching brags from Google Sheets...');
        console.log(
          'Parsed rows:',
          rows.map((row) => row.split(',')),
        );

        return rows.map((row) => {
          const [id, title, description] = row.split(',');
          return {
            id: +id,
            title: title?.trim(),
            description: description?.trim(),
          };
        });
      }),
    );
  }
}
