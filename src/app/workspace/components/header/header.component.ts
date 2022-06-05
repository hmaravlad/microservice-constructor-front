import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SimpleModalService } from 'ngx-simple-modal';
import { Observable } from 'rxjs';
import { isErrorResponse } from 'src/app/http-utils/query-error.entity';
import { ProjectService } from 'src/app/projects/project.service';
import { EntityService } from '../../services/entity.service';
import { ErrorsService } from '../../services/errors.service';
import { ProjectDataService } from '../../services/project.service';
import { SidePanelControllerService } from '../../services/side-panel-controller.service';
import { ConfirmComponent } from '../confirm/confirm.component';

@Component({
  selector: 'app-workspace-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements AfterViewInit {
  constructor(
    private sidePanelControllerService: SidePanelControllerService,
    private projectService: ProjectService,
    private entityService: EntityService,
    private simpleModalService: SimpleModalService,
    private errorsService: ErrorsService,
    private router: Router,
    public projectDataService: ProjectDataService,
  ) { }

  @Input() projectId = 0;

  @ViewChild('fileLink', { static: true }) fileLink!: ElementRef;

  ngAfterViewInit(): void {
  }

  onNameChange(data: string) {
    if (data === undefined) return;
    const key = 'project-name';
    if (data.trim() === '') {
      this.errorsService.addStateError('Project name can\'t be empty', key);
    } else {
      this.errorsService.removeStateError(key);
    }
  }

  onChangeSettings(): void {
    this.sidePanelControllerService.openProjectConfigEditor();
  }

  onSave(): void {
    if (!this.checkSave()) return;
    this.save();
  }

  onSaveAndExit(): void {
    if (!this.checkSave()) return;
    this.save().subscribe(x => {
      if (isErrorResponse(x)) {
        throw new Error();
      }
      this.router.navigateByUrl('projects');
    });
  }

  checkSave():boolean {
    const canSave = !this.errorsService.areCurrentErrors();
    if (!canSave) {
      this.errorsService.addEventError('Can\'t save project while errors are not fixed');
    }
    return canSave;
  }

  save(): Observable<unknown> {
    const project = this.projectDataService.export();
    const entities = this.entityService.exportEntities();
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

  onDelete() {
    this.simpleModalService.addModal(ConfirmComponent, {
      title: 'Delete',
      message: 'Are you sure you want to delete this project ?',
    }, { animationDuration: 1 })
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.projectService.deleteProject(this.projectId).subscribe(x => {
            if (!isErrorResponse(x)) {
              this.router.navigateByUrl('/projects');
            }
          });
        }
      });
  }
}
