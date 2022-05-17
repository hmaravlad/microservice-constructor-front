import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { ProjectsComponent } from './projects.component';
import { RouterModule } from '@angular/router';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectComponent } from './project/project.component';



@NgModule({
  declarations: [
    HeaderComponent,
    ProjectsComponent,
    ProjectListComponent,
    ProjectComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
})
export class ProjectsModule { }
