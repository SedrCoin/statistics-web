import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './views/main/main.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from './views/menu/menu.component';
import { FuturesComponent } from './views/futures/futures.component';
import { TableComponent } from './views/table/table.component';

@NgModule({
	declarations: [
		AppComponent,
		MainComponent,
		MenuComponent,
		FuturesComponent,
		TableComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		ReactiveFormsModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}
