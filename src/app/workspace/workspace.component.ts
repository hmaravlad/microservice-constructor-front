import { Component, OnInit } from '@angular/core';
import { ProjectDataService } from './services/project.service';
import { SidePanelControllerService } from './services/side-panel-controller.service';
import { SidePanelState } from './types/side-panel-state';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css'],
})
export class WorkspaceComponent implements OnInit {
  constructor(
    private sidePanelControllerService: SidePanelControllerService,
    private projectService: ProjectDataService,
  ) {}

  sidePanelState = SidePanelState.Closed;
  isSidePanelOpened = false;

  ngOnInit(): void {
    this.projectService.init();
    this.sidePanelControllerService.getPanelState().subscribe(state => {
      this.sidePanelState = state;
      this.isSidePanelOpened = state !== SidePanelState.Closed;
    });
  }
}
