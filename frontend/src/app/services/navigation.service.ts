import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  public hideSidebar = new BehaviorSubject(window.innerWidth <= 540);
  public hideSidebar$ = this.hideSidebar.asObservable();

  /**
   * Показывает/скрывает сайдбар если ширина экрана менее 540 пикселей.
   */
  public triggerSidebar() {
    if (window.innerWidth <= 540) {
      this.hideSidebar.next(!this.hideSidebar.value);
    }
  }
}
