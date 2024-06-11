import { Routes } from '@angular/router';
import { SpotComponent } from './views/spot/spot.component';
import { FuturesComponent } from './views/futures/futures.component';

export const routes: Routes = [
	{ path: 'spot', component: SpotComponent },
	{ path: 'futures', component: FuturesComponent },
	{ path: '', redirectTo: '/spot', pathMatch: 'full' }, // redirect to spot for base route
	{ path: '**', redirectTo: '/spot', pathMatch: 'full' }, // redirect to spot -> wildcard
];
