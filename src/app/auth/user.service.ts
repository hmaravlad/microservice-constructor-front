import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { User } from './user.entity';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ErrorResponse } from './query-error.entity';
import { UserCredentials } from './user-credentials.entity';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  register(user: UserCredentials): Observable<HttpResponse<unknown> | ErrorResponse> {
    return this.http.post(`${environment.apiUrl}/auth/register`, user, { observe: 'response', withCredentials: true })
      .pipe(
        catchError(this.handleError),
        shareReplay(1),
      );
  }

  login(user: UserCredentials): Observable<User | ErrorResponse> {
    return this.http.post<User>(`${environment.apiUrl}/auth/login`, user, { observe: 'response', withCredentials: true })
      .pipe(
        catchError(this.handleError),
        map(this.extractBody),
        shareReplay(1),
      );
  }

  getUser(): Observable<User | ErrorResponse> {
    return this.http.get<User>(`${environment.apiUrl}/auth/me`, { observe: 'response', withCredentials: true })
      .pipe(
        catchError(this.handleError),
        map(this.extractBody),
        shareReplay(1),
      );
  }

  logout(): Observable<HttpResponse<unknown> | ErrorResponse> {
    return this.http.post(`${environment.apiUrl}/auth/register`, null, { observe: 'response', withCredentials: true })
      .pipe(
        catchError(this.handleError),
        shareReplay(1),
      );
  }

  extractBody<T>(x: HttpResponse<T> | ErrorResponse): T | ErrorResponse {
    if (x instanceof HttpResponse) {
      if (!x.body) throw new Error();
      return x.body;
    }
    return x;
  }

  handleError(x: HttpErrorResponse): Observable<ErrorResponse> {
    if (x.status === 0) {
      return of({ message: ['Something wrong happened. Try again later.'], error: 'Not Found', statusCode: 0 });
    } 
    if (x.status === 404) {
      return of({ message: ['Server is not available. Try again later.'], error: 'Not Found', statusCode: 404 });
    }
    if (!Array.isArray(x.error.message)) x.error.message = [x.error.message];
    return of(x.error as ErrorResponse);
  }
}
