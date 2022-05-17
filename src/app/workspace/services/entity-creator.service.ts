import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EntityCreatorService {
  createEntitySubject = new Subject<string>();

  addCreateEntityEvent(event: Observable<unknown>, type: string) {
    event.subscribe(() => {
      this.createEntitySubject.next(type);
    });
  }

  onCreateEntity(): Observable<string> {
    return this.createEntitySubject.asObservable();
  }
}
