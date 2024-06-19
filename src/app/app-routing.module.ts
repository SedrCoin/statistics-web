import { Routes } from '@angular/router';
import { BaseViewComponent } from './views/base-view/base-view.component';
import { MainComponent } from './views/main/main.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
	{ path: 'welcome', component: MainComponent },
	{ path: '', component: BaseViewComponent, pathMatch: 'full', canActivate: [AuthGuard] },
	{ path: '**', redirectTo: '/', pathMatch: 'full' }, // redirect to spot -> wildcard
];
