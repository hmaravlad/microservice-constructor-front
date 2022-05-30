import { Injectable } from '@angular/core';

@Injectable()
export class IdGeneratorService {
  counter = 0;

  getId(): number {
    this.counter += 1;
    return this.counter;
  }

  trySetMaxId(id: number) {
    if (id > this.counter) {
      this.counter = id + 1;
    }
  }
}
