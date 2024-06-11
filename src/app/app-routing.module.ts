import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './views/main/main.component';
import { FuturesComponent } from './views/futures/futures.component';

const routes: Routes = [{
	path: '', component: MainComponent
},
	{ path: 'futures', component: FuturesComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {

}
