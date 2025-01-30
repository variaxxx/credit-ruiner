import {AfterViewInit, ChangeDetectionStrategy, Component} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {ButtonComponent} from "../../../ui-kit/components/button/button.component";
import {BehaviorSubject} from "rxjs";
import {LinkComponent} from "../../../ui-kit/components/link/link.component";

@Component({
  selector: 'app-home-page',
  imports: [
    ButtonComponent,
    AsyncPipe,
    LinkComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent implements AfterViewInit {

  public isLoading = new BehaviorSubject(true);
  public isLoading$ = this.isLoading.asObservable();

  ngAfterViewInit() {
    this.isLoading.next(false);
  }
}
