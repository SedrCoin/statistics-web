import { Component, Input } from '@angular/core';
import { IWSLOG } from '../../models/models';

@Component({
	selector: 'app-table',
	standalone: true,
	templateUrl: './table.component.html',
	styleUrl: './table.component.scss'
})
export class TableComponent {
	@Input() public logs: IWSLOG[] = [];
}
