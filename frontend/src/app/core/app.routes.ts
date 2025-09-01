import { Routes } from '@angular/router';
import { BragCardComponent } from '../shared/brag-card.component/brag-card.component';

export const routes: Routes = [{ path: '', component: BragCardComponent, outlet: 'primary' }];
