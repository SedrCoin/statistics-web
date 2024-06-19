import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { MarketTypeEnum, PageService } from '../../services/page.service';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-menu',
	standalone: true,
	host: { style: 'display: contents' },
	templateUrl: './menu.component.html',
	imports: [NgClass, RouterLink],
	styleUrl: './menu.component.scss'
})
export class MenuComponent {
	protected readonly MarketTypeEnum = MarketTypeEnum;

	public currentPage: MarketTypeEnum;

	constructor(private pageService: PageService) {
		this.pageService.currentPage$
			.subscribe((page: MarketTypeEnum): void => {
				this.currentPage = page;
			})
	}

	public onUpdateCurrentSection(sectionType: MarketTypeEnum): void {
		this.pageService.currentPage$.next(sectionType);
	}
}
