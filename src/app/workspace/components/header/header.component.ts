import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { isErrorResponse } from 'src/app/http-utils/query-error.entity';
import { ProjectService } from 'src/app/projects/project.service';
import { EntityService } from '../../services/entity.service';
import { ProjectDataService } from '../../services/project.service';
import { SidePanelControllerService } from '../../services/side-panel-controller.service';

@Component({
  selector: 'app-workspace-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private sidePanelControllerService: SidePanelControllerService,
    private projectDataService: ProjectDataService,
    private projectService: ProjectService,
    private entityService: EntityService,
    private router: Router,
  ) {}

  @Input() projectId = 0;

  @ViewChild('fileLink', { static: true }) fileLink!: ElementRef;

  ngOnInit(): void {
  }

  onStringInput(event: Event) {
    const elem = event.target as HTMLInputElement;
    const data = elem.value;
    if (!data) return;
    this.projectDataService.setName(data);
  }

  onChangeSettings(): void {
    this.sidePanelControllerService.openProjectConfigEditor();
  }

  onSave(): void {
    this.save();
  }

  onSaveAndExit(): void {
    this.save().subscribe(x => {
      if (isErrorResponse(x)) {
        console.dir({ x });
        throw new Error();
      }
      this.router.navigateByUrl('projects');
    });
  }

  save(): Observable<unknown> {
    const project = this.projectDataService.export();
    const entities = this.entityService.exportEntities();
    console.dir({ entities });
    return this.projectService.saveProject(this.projectId, project, entities);
  }

  onExit() {
    this.router.navigateByUrl('projects');
  }

  onExport() {
    const element = this.fileLink.nativeElement;
    const { data, name } = this.projectDataService.getFullConfig();
    const text = data;
    const fileName = `${name.replace(/ /g, '-')}-config.json`;
    const fileType = 'text/plain';
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(text)}`);
    element.setAttribute('download', fileName);
    const event = new MouseEvent('click');
    element.dispatchEvent(event);
  }
}
