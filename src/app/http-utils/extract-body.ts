import { HttpResponse } from '@angular/common/http';
import { ErrorResponse } from './query-error.entity';

export function extractBody<T>(x: HttpResponse<T> | ErrorResponse): T | ErrorResponse {
  if (x instanceof HttpResponse) {
    if (!x.body) throw new Error();
    return x.body;
  }
  return x;
}
