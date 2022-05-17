import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { Line } from '../types/line';

@Injectable({
  providedIn: 'root',
})
export class LinesCreatorService {

  lastLines = new Map<Observable<Line>, Line>();

  subscriptions = new Map<Observable<Line>, Subscription>();

  lastLines$ = new Subject<Line[]>();

  addLine(line$: Observable<Line>) {
    const subscription = line$.subscribe(line => {
      this.lastLines.set(line$, line);
      this.lastLines$.next(Array.from(this.lastLines.values()));
    });
    this.subscriptions.set(line$, subscription);
  }

  removeLine(line$: Observable<Line>) {
    const subscription = this.subscriptions.get(line$);
    if (subscription) subscription.unsubscribe();
    this.subscriptions.delete(line$);
    this.lastLines.delete(line$);
    this.lastLines$.next(Array.from(this.lastLines.values()));
  }

  get():Observable<Line[]> {
    return this.lastLines$;
  }
}
