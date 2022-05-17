import { Component, Input, OnInit } from '@angular/core';
import { SidePanelControllerService } from '../../services/side-panel-controller.service';
import { APIConfig, EndpointGroup, Entity } from '../../types/api-config';

@Component({
  selector: 'app-api-editor',
  templateUrl: './api-editor.component.html',
  styleUrls: ['./api-editor.component.css'],
})
export class ApiEditorComponent implements OnInit {
  constructor(
    private sidePanelControllerService: SidePanelControllerService,
  ) {}

  @Input() apiConfig: APIConfig = { endpointGroups: [] };
  @Input() id: number;

  counter = 0;

  onSubmit() {
    this.sidePanelControllerService.closeIfAPIEditor();
  }

  addId(): number {
    this.counter += 1;
    return this.counter;
  }

  ngOnInit(): void {
  }

  addEndpointGroup(): void {
    this.apiConfig.endpointGroups.push({
      endpoints: [],
      entities: [],
      name: '',
      prefix: '',
    });
  }

  addEndpoint(endpointGroup: EndpointGroup): void {
    endpointGroup.endpoints.push({
      method: 'GET',
      name: '',
      path: '',
      request: {
        content: {
          type: 'string',
        },
        statusCode: 200,
      },
      response: {
        content: {
          type: 'string',
        },
        statusCode: 200,
      },
    });
  }

  addEntity(endpointGroup: EndpointGroup): void {
    endpointGroup.entities.push({
      id: this.addId(),
      name: '',
      fields: [],
    });
  }

  addField(entity: Entity): void {
    entity.fields.push({
      name: '',
      type: 'string',
    });
  }
}
