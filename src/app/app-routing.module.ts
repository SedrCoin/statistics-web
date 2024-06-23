import { Routes } from '@angular/router';
import { BaseViewComponent } from './views/base-view/base-view.component';
import { WelcomeComponent } from './views/main/welcome.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
	{ path: 'main', component: BaseViewComponent, pathMatch: 'full' },
	{ path: 'welcome', component: WelcomeComponent, pathMatch: 'full' },
	{ path: '', redirectTo: '/main', pathMatch: 'full' },
	{ path: '**', redirectTo: '/welcome', pathMatch: 'full' }, // redirect to spot -> wildcard,
];
