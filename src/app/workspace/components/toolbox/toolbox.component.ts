import { Component, OnInit } from '@angular/core';
import { EntityDescriptionProviderService } from '../../services/entity-description-provider.service';
import { EntityDescription } from '../../types/entity-description';

@Component({
  selector: 'app-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.css'],
})
export class ToolboxComponent implements OnInit {

  constructor(private entityInfoProvider: EntityDescriptionProviderService) { }

  entities: EntityDescription[] = [];

  ngOnInit(): void {
    this.entities = this.entityInfoProvider.getEntityDescription();
  }

}
