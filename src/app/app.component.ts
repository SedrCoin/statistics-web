import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './views/menu/menu.component';

@Component({
	selector: 'app-root',
	standalone: true,
	host: { style: 'display: contents' },
	templateUrl: './app.component.html',
	imports: [RouterOutlet, MenuComponent],
})
export class AppComponent {
	title = 'statistics-web';
}
