import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

export interface MenuItem {
    label: string;
    icon: string;
    url: string;
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  public hideSidebar = new BehaviorSubject(window.innerWidth <= 540);
  public hideSidebar$ = this.hideSidebar.asObservable();

  public menuItems: MenuItem[] = [
    {
      label: 'Анализ',
      icon: 'bar-chart-3',
      url: '/analysis'
    },
    {
      label: 'История',
      icon: 'history',
      url: '/history'
    },
    {
      label: 'Профиль',
      icon: 'user',
      url: '/profile'
    }
  ]

  /**
   * Показывает/скрывает сайдбар если ширина экрана менее 540 пикселей.
   */
  public triggerSidebar() {
    if (window.innerWidth <= 540) {
      this.hideSidebar.next(!this.hideSidebar.value);
    }
  }
}
