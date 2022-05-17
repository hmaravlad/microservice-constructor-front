import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';
import { extractBody } from '../http-utils/extract-body';
import { handleHttpError } from '../http-utils/handle-http-error';
import { ErrorResponse } from '../http-utils/query-error.entity';
import { Project } from './project.entity';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[] | ErrorResponse> {
    return this.http.get<Project[]>(`${environment.apiUrl}/projects`, { observe: 'response', withCredentials: true })
      .pipe(
        catchError(handleHttpError),
        map(extractBody),
        shareReplay(1),
      );
  }
}
