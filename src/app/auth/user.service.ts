import { Injectable } from '@angular/core';
import { catchError, map, Observable, shareReplay } from 'rxjs';
import { User } from './user.entity';
import { HttpClient,  HttpResponse } from '@angular/common/http';
import { ErrorResponse } from '../http-utils/query-error.entity';
import { UserCredentials } from './user-credentials.entity';
import { environment } from '../../environments/environment';
import { handleHttpError } from '../http-utils/handle-http-error';
import { extractBody } from '../http-utils/extract-body';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  register(user: UserCredentials): Observable<HttpResponse<unknown> | ErrorResponse> {
    return this.http.post(`${environment.apiUrl}/auth/register`, user, { observe: 'response', withCredentials: true })
      .pipe(
        catchError(handleHttpError),
        shareReplay(1),
      );
  }

  login(user: UserCredentials): Observable<User | ErrorResponse> {
    return this.http.post<User>(`${environment.apiUrl}/auth/login`, user, { observe: 'response', withCredentials: true })
      .pipe(
        catchError(handleHttpError),
        map(extractBody),
        shareReplay(1),
      );
  }

  getUser(): Observable<User | ErrorResponse> {
    return this.http.get<User>(`${environment.apiUrl}/auth/me`, { observe: 'response', withCredentials: true })
      .pipe(
        catchError(handleHttpError),
        map(extractBody),
        shareReplay(1),
      );
  }

  logout(): Observable<HttpResponse<unknown> | ErrorResponse> {
    return this.http.post(`${environment.apiUrl}/auth/logout`, null, { observe: 'response', withCredentials: true })
      .pipe(
        catchError(handleHttpError),
        shareReplay(1),
      );
  }
}
