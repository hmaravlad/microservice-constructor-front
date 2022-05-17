import { Component, OnInit } from '@angular/core';
import { SidePanelControllerService } from './services/side-panel-controller.service';
import { SidePanelState } from './types/side-panel-state';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css'],
})
export class WorkspaceComponent implements OnInit {
  constructor(private sidePanelControllerService: SidePanelControllerService) {}

  sidePanelState = SidePanelState.Closed;
  isSidePanelOpened = false;

  ngOnInit(): void {
    this.sidePanelControllerService.getPanelState().subscribe(state => {
      this.sidePanelState = state;
      this.isSidePanelOpened = state !== SidePanelState.Closed;
    });
  }
}
