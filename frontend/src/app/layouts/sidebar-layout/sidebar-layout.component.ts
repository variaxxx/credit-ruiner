import {ChangeDetectionStrategy, Component, HostListener} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {HeaderComponent} from "../../partials/header/header.component";

@Component({
	selector: 'app-sidebar-layout',
	imports: [
		RouterOutlet,
		HeaderComponent
	],
	templateUrl: './sidebar-layout.component.html',
	styleUrl: './sidebar-layout.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarLayoutComponent {
	public showHeader: boolean = window.innerWidth <= 540;

	@HostListener('window:resize', ['$event']) onResize() {
		this.showHeader = window.innerWidth <= 540;
	}
}
