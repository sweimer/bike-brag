import { Routes } from '@angular/router';
import { HomeComponent } from '../features/home';
import { ParallaxComponent } from '../shared/parallax/parallax';
import { BragBoard } from '../features/bragboard';

export const routes: Routes = [
  { path: '', component: HomeComponent, outlet: 'primary' },
  { path: '', component: ParallaxComponent, outlet: 'prarallax' },
  { path: '', component: BragBoard, outlet: 'bragboard' }
];
