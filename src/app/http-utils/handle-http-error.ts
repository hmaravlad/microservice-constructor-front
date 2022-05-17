import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ErrorResponse } from './query-error.entity';

export function handleHttpError(x: HttpErrorResponse): Observable<ErrorResponse> {
  if (x.status === 0) {
    return of({ message: ['Something wrong happened. Try again later.'], error: 'Not Found', statusCode: 0 });
  } 
  if (x.status === 404) {
    return of({ message: ['Server is not available. Try again later.'], error: 'Not Found', statusCode: 404 });
  }
  if (!Array.isArray(x.error.message)) x.error.message = [x.error.message];
  return of(x.error as ErrorResponse);
}
