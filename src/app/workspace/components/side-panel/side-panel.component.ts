import { Component, Input, OnInit } from '@angular/core';
import { EntityService } from '../../services/entity.service';
import { APIConfig } from '../../types/api-config';
import { SidePanelState } from '../../types/side-panel-state';

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.css'],
})
export class SidePanelComponent implements OnInit {
  constructor(private entityService: EntityService) {}

  @Input() state = SidePanelState.Closed;
  isAPIEditor = false;
  isProjectEditor = false;
  
  apiConfig: APIConfig = { endpointGroups: [] };
  id = 0;

  

  ngOnInit(): void {
    this.isAPIEditor = this.state === SidePanelState.APIEditor;
    this.isProjectEditor = this.state === SidePanelState.ProjectConfigEditor;
    this.entityService.activeEntity.subscribe((entity) => {
      if (this.state !== SidePanelState.APIEditor) return;
      if (!entity) return;
      const apiField = entity.fields['api'];
      if (!apiField) return;
      this.id = entity.id;
      this.apiConfig = apiField.getValue() as APIConfig;
    });
  }
}
