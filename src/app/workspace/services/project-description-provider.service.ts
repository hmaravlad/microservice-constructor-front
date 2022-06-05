import { Injectable } from '@angular/core';
import { getProjectConfigData } from 'microservice-constructor';
import { ProjectDescription } from '../types/project-description';

@Injectable({
  providedIn: 'root',
})
export class ProjectDescriptionProviderService {
  private projectDescription = {
    fields: getProjectConfigData().filter((field) => field.name !== 'name'),
  };
  getProjectDescription(): ProjectDescription {
    return this.projectDescription;
  }
}
