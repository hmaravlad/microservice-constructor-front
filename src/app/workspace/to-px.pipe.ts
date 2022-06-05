import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'toPx' })
export class ToPxPipe implements PipeTransform {
  transform(value: number): string {
    return value + 'px';
  }
}