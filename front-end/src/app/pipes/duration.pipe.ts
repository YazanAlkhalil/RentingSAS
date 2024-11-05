import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
  standalone: true
})
export class DurationPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    const days = Math.floor(value / (1000 * 60 * 60 * 24));
    return `${days} days left`;
  }

}
