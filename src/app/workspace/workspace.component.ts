import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isErrorResponse } from '../http-utils/query-error.entity';
import { ProjectService } from '../projects/project.service';
import { ErrorsService } from './services/errors.service';
import { EntityService } from './services/entity.service';
import { IdGeneratorService } from './services/id-generator.service';
import { LinesCreatorService } from './services/lines-creator.service';
import { ProjectDataService } from './services/project.service';
import { SidePanelControllerService } from './services/side-panel-controller.service';
import { SidePanelState } from './types/side-panel-state';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css'],
  providers: [ProjectDataService, EntityService, LinesCreatorService, IdGeneratorService, ErrorsService],
})
export class WorkspaceComponent implements OnInit {
  constructor(
    private sidePanelControllerService: SidePanelControllerService,
    private projectDataService: ProjectDataService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
  ) { }

  sidePanelState = SidePanelState.Closed;
  isSidePanelOpened = false;
  projectId = 0;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) throw new Error();
      this.projectId = parseInt(id);
      this.projectService.getProject(this.projectId).subscribe(project => {
        if (isErrorResponse(project)) {
          throw new Error();
        }
        this.projectDataService.init(project);
      });
    });
    this.sidePanelControllerService.getPanelState().subscribe(state => {
      this.sidePanelState = state;
      this.isSidePanelOpened = state !== SidePanelState.Closed;
    });
  }
}
