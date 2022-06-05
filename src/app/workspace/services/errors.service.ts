import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ErrorsService {
  count = ((i = 0) => () => i++)();

  private stateErrors: { [key: string]: string } = {};
  private stateErrors$ = new BehaviorSubject<string[]>([]);

  private eventErrors: { id: number, message: string }[] = [];
  private eventErrors$ = new BehaviorSubject<{ id: number, message: string }[]>([]);

  addEventError(message: string): void {
    const id = this.count();
    this.eventErrors.push({ id, message });
    this.updateEventErrors();
  }

  removeEventError(id: number) {
    const i = this.eventErrors.findIndex((error) => error.id === id);
    if (i === -1) return;
    this.eventErrors.splice(i, 1);
    this.updateEventErrors();
  }

  updateEventErrors() {
    this.eventErrors$.next(this.eventErrors);
  }

  getEventErrors(): Observable<{ id: number, message: string }[]> {
    return this.eventErrors$.asObservable();
  }

  addStateError(message: string, key: string): string {
    key = key || this.count().toString();

    this.stateErrors[key] = message;
    this.updateStateErrors();
    
    return key;
  }

  removeStateError(key: string) {
    delete  this.stateErrors[key];
    this.updateStateErrors();
  }

  updateStateErrors() {
    this.stateErrors$.next(Object.values(this.stateErrors));
  }

  getStateErrors(): Observable<string[]> {
    return this.stateErrors$.asObservable();
  }

  areCurrentErrors(): boolean {
    return Object.values(this.stateErrors).length !== 0;
  }
}
