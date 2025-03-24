import {animate, style, transition, trigger} from "@angular/animations";

export const onOpenAnimation = trigger('onOpen', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateY(-10px)',
    }),
    animate('300ms ease-in-out', style({
      opacity: 1,
      transform: 'translateY(0)',
    }))
  ])
]);
