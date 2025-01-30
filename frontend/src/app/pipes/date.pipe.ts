import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date'
})
export class DatePipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return '1';
  }
}
