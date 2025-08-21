import { Routes } from '@angular/router';
import { HomeComponent } from '../features/home';

export const routes: Routes = [
  { path: '', component: HomeComponent, outlet: 'primary' },
];
