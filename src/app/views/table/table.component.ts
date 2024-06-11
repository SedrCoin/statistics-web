import { Component, Input } from '@angular/core';
import { IWSLOG } from '../../models/models';

@Component({
	selector: 'app-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss']
})
export class TableComponent {
	@Input() public logs: IWSLOG[] = [];
}
