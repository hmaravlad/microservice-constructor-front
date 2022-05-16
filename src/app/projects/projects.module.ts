import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { ProjectsComponent } from './projects.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    HeaderComponent,
    ProjectsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
})
export class ProjectsModule { }
