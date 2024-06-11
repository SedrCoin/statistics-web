import { Routes } from '@angular/router';
import { MainComponent } from './views/main/main.component';
import { FuturesComponent } from './views/futures/futures.component';

export const routes: Routes = [
	{
		path: '', component: MainComponent
	},
	{
		path: 'futures', component: FuturesComponent
	}
];
