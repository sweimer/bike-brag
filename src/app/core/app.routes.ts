import { Routes } from '@angular/router';
import { BragCardGroup } from '../shared/brag-card-group/brag-card-group.component';

export const routes: Routes = [
  { path: '', component: BragCardGroup, outlet: 'primary' },
];
