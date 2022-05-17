import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IdGeneratorService {
  counter = 0;

  getId(): number {
    this.counter += 1;
    return this.counter;
  }
}
