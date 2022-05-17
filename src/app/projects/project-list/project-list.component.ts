import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { isErrorResponse } from 'src/app/http-utils/query-error.entity';
import { Project } from '../project.entity';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
})
export class ProjectListComponent implements OnInit {
  constructor(
    private projectService: ProjectService,
    private router: Router,
  ) { }

  projects: Project[] = [];

  currProject: Project | undefined;

  ngOnInit(): void {
    this.projectService.getProjects().subscribe(projects => {
      if (!Array.isArray(projects) || isErrorResponse(projects)) {
        this.router.navigateByUrl('sign-in');
        return;
      }
      this.projects = projects;
      if (projects.length > 0) this.currProject = projects[0];
    });
  }

  setCurrProject(project: Project) {
    this.currProject = project;
  }

  newProject() {

  }
}
