import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EntityDescriptionProviderService } from './entity-description-provider.service';
import { FieldDescription } from '../types/field-description';
import { FieldValue } from '../types/field-type';
import { Entity } from '../types/entity';

@Injectable({
  providedIn: 'root',
})
export class EntityService {
  constructor(private entityDescriptionProviderService: EntityDescriptionProviderService) { }

  entities: Entity[] = [];

  activeEntity = new BehaviorSubject<Entity | undefined>(undefined);

  addEntity(id: number, type: string) {
    if (this.entities.find((e) => e.id === id)) throw new Error('Invalid id assignment. There already exists entity with this id');
    const entityDescription = this.entityDescriptionProviderService.getEntityDescription();

    const fieldDescriptions = entityDescription.find(e => e.name === type)?.fields.filter(f => !f.isId && !f.references) || [];
    const relationDescriptions = entityDescription.find(e => e.name === type)?.fields.filter(f => f.references) || [];

    const fields: Record<string, BehaviorSubject<FieldValue>> = {};
    const relations: Record<string, number[]> = {};
  
    for (const relation of relationDescriptions) {
      relations[relation.name] = [];
    }

    for (const field of fieldDescriptions) {
      const value = this.getDefaultValue(field);
      fields[field.name] = new BehaviorSubject(value);
    }

    this.entities.push({ id, type, fields, relations });
  }

  getDefaultValue(field: FieldDescription): FieldValue {
    const defaultType: Record<string, FieldValue> = {
      'number': 1,
      'string': '',
      'boolean': false,
      'enum': field.possibleValues ? field.possibleValues[0] : '',
      'APIConfig': { endpointGroups: [] },
    };
    const value = defaultType[field.type];
    if (value === undefined) throw new Error('Invalid field type');
    return value;
  }

  removeEntity(id: number) {
    const i = this.entities.findIndex((e) => e.id === id);
    const entity = this.entities[i];
    if (!entity) throw new Error('There is no entity with provided id');
    this.entities.splice(i, 1);
  }

  enableSelection(dblclick$: Observable<MouseEvent>, entityId: number) {
    dblclick$.subscribe(() => {
      this.activeEntity.next(this.entities.find(entity => entity.id === entityId));
    });
  }

  enableSelectionRemoving(canvasClick$: Observable<MouseEvent>) {
    canvasClick$.subscribe(() => {
      this.activeEntity.next(undefined);
    });
  }

  setField(id: number, field: string, value: FieldValue) {
    const entity = this.entities.find(e => e.id === id);
    if (!entity) throw new Error('There is no entity with provided id');
    const data = entity.fields[field];
    if (!data) throw new Error('Invalid entity field');
    data.next(value);
  }

  getField(id: number, field: string): Observable<FieldValue> | undefined {
    const entity = this.entities.find(e => e.id === id);
    if (!entity) return;
    const data = entity.fields[field];
    if (!data) return;
    return data;
  }

  getFieldValue(id: number, field: string): FieldValue | undefined {
    const entity = this.entities.find(e => e.id === id);
    if (!entity) return;
    const data = entity.fields[field].getValue();
    if (!data) return;
    return data;
  }

  addRelation(id1: number, id2: number): boolean {
    const entity1 = this.entities.find(e => e.id === id1);
    if (!entity1) return false;
    const entity2 = this.entities.find(e => e.id === id2);
    if (!entity2) return false;
    const entityData1 = this.entityDescriptionProviderService.getEntityDescription().find(e => e.name === entity1.type);
    const entityData2 = this.entityDescriptionProviderService.getEntityDescription().find(e => e.name === entity2.type);
    const referenceField1 = entityData1?.fields.find(f => f.references?.includes(entity2.type));
    const referenceField2 = entityData2?.fields.find(f => f.references?.includes(entity1.type));
    if (referenceField1) {
      entity1.relations[referenceField1.name].push(entity2.id);
      return true;
    }
    if (referenceField2) {
      entity2.relations[referenceField2.name].push(entity1.id);
      return true;
    }
    return false;
  }
}
