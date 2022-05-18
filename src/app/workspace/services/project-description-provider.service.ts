import { Injectable } from '@angular/core';
import { ProjectDescription } from '../types/project-description';

@Injectable({
  providedIn: 'root',
})
export class ProjectDescriptionProviderService {
  getProjectDescription(): ProjectDescription {
    return {
      fields: [
        { name: 'name', type: 'string' },
        { name: 'cicd', type: 'enum', possibleValues: [ 'github-actions-digitalocean' ] },
        { name: 'dockerUsername', type: 'string' },
      ],
    };
  }
}
