import { Routes } from '@angular/router';
import { BaseViewComponent } from './views/base-view/base-view.component';
import { MainComponent } from './views/main/main.component';

export const routes: Routes = [
	{path: 'welcome', component: MainComponent},
	{ path: '', component: BaseViewComponent, pathMatch: 'full' },
	{ path: '**', redirectTo: '/', pathMatch: 'full' }, // redirect to spot -> wildcard
];
