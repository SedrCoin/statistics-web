import { Routes } from '@angular/router';
import { SpotComponent } from './views/spot/spot.component';
import { FuturesComponent } from './views/futures/futures.component';
import { MainComponent } from './views/main/main.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
	{path: 'welcome', component: MainComponent},
	{ path: 'spot', component: SpotComponent, canActivate: [AuthGuard]},
	{ path: 'futures', component: FuturesComponent },
	// { path: '', redirectTo: '/spot', pathMatch: 'full' }, // redirect to spot for base route
	// { path: '**', redirectTo: '/spot', pathMatch: 'full' }, // redirect to spot -> wildcard
];
