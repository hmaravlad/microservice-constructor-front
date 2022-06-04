import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';
import { extractBody } from '../http-utils/extract-body';
import { handleHttpError } from '../http-utils/handle-http-error';
import { ErrorResponse } from '../http-utils/query-error.entity';
import { EntityExported } from '../workspace/types/entity-exported';
import { ProjectExported } from '../workspace/types/project-exported';
import { Project, ProjectFull } from './project.entity';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private http: HttpClient) { }

  getProjects(): Observable<Project[] | ErrorResponse> {
    return this.http.get<Project[]>(`${environment.apiUrl}/projects`, { observe: 'response', withCredentials: true })
      .pipe(
        catchError(handleHttpError),
        map(extractBody),
        shareReplay(1),
      );
  }

  getProject(projectId: number): Observable<ProjectFull | ErrorResponse> {
    return this.http.get<ProjectFull>(`${environment.apiUrl}/projects/${projectId}`, { observe: 'response', withCredentials: true })
      .pipe(
        catchError(handleHttpError),
        map(extractBody),
        shareReplay(1),
      );
  }

  newProject(project: ProjectExported): Observable<number | ErrorResponse> {
    return this.http.post<number>(`${environment.apiUrl}/projects/`, project, { observe: 'response', withCredentials: true })
      .pipe(
        catchError(handleHttpError),
        map(extractBody),
        shareReplay(1),
      );
  }

  saveProject(projectId: number, project: ProjectExported, entities: EntityExported[]): Observable<HttpResponse<unknown> | ErrorResponse> {
    return this.http.post(`${environment.apiUrl}/projects/${projectId}/save`, { project, entities }, { observe: 'response', withCredentials: true })
      .pipe(
        catchError(handleHttpError),
        shareReplay(1),
      );
  }

  deleteProject(projectId: number): Observable<HttpResponse<unknown> | ErrorResponse> {
    return this.http.delete(`${environment.apiUrl}/projects/${projectId}`, { observe: 'response', withCredentials: true })
      .pipe(
        catchError(handleHttpError),
        shareReplay(1),
      );
  }
}
