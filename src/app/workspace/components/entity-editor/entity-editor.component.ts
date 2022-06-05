import { AfterViewInit, Component } from '@angular/core';
import { SimpleModalService } from 'ngx-simple-modal';
import { EntityDescriptionProviderService } from '../../services/entity-description-provider.service';
import { EntityService } from '../../services/entity.service';
import { SidePanelControllerService } from '../../services/side-panel-controller.service';
import { Entity } from '../../types/entity';
import { EntityInputData } from '../../types/entity-input-data';
import { FieldDescription } from '../../types/field-description';
import { ConfirmComponent } from '../confirm/confirm.component';

@Component({
  selector: 'app-entity-editor',
  templateUrl: './entity-editor.component.html',
  styleUrls: ['./entity-editor.component.css'],
})
export class EntityEditorComponent implements AfterViewInit {
  activeEntity: Entity | undefined;
  entitiesInputData: EntityInputData[] = [];

  constructor(
    private entityService: EntityService,
    private entityDescriptions: EntityDescriptionProviderService,
    private sidePanelControllerService: SidePanelControllerService,
    private simpleModalService: SimpleModalService,
  ) { }

  ngAfterViewInit(): void {
    this.entityService.activeEntity.subscribe((entity) => {
      this.activeEntity = entity;
      if (entity) {
        this.entitiesInputData = this.getFields(entity).map(fieldDescription => ({
          fieldDescription,
          id: entity.id,
        }));
      } else {
        this.sidePanelControllerService.closeIfAPIEditor();
      }
    });
  }

  getFields(entity: Entity): FieldDescription[] {
    const entityData = this.entityDescriptions.getEntityDescription().find(e => e.name === entity.type);
    if (!entityData) throw new Error();
    return entityData.fields.filter((field) => {
      return !field.isId && !field.references;
    });
  }

  removeAllConnections() {
    if (this.activeEntity) {
      this.entityService.removeAllRelations(this.activeEntity.id);
    }
  }

  removeEntity() {
    this.simpleModalService.addModal(ConfirmComponent, {
      title: 'Delete',
      message: 'Are you sure you want to delete this entity ?',
    }, { animationDuration: 1 }).subscribe(isSubmitted => {
      if (isSubmitted && this.activeEntity) {
        this.entityService.removeAllRelations(this.activeEntity.id);
        this.entityService.removeEntity(this.activeEntity.id);
      }
    });
  }
}
