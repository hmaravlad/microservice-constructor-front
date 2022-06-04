import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, Subject } from 'rxjs';
import { EntityDescriptionProviderService } from './entity-description-provider.service';
import { FieldDescription } from '../types/field-description';
import { FieldValue } from '../types/field-type';
import { Entity } from '../types/entity';
import { Relation } from '../types/relation';
import { EntityComponent } from '../components/entity/entity.component';
import { LinesCreatorService } from './lines-creator.service';
import { EntityExported } from '../types/entity-exported';
import { IdGeneratorService } from './id-generator.service';
import { APIConfig, EntityRef, isAPIConfig } from '../types/api-config';
import { ErrorsService } from './errors.service';

@Injectable()
export class EntityService {
  entities: Entity[] = [];

  activeEntity = new BehaviorSubject<Entity | undefined>(undefined);

  relations: Relation[] = [];

  entityComponents = new Map<number, EntityComponent>();

  deletedEntityId$ = new Subject<number>();

  projectId = 1;
  initEntitiesLength = 0;

  constructor(
    private entityDescriptionProviderService: EntityDescriptionProviderService,
    private linesCreatorService: LinesCreatorService,
    private idGenerator: IdGeneratorService,
    private errorsService: ErrorsService,
  ) { }

  observeEntityComponent(id: number, entityComponent: EntityComponent) {
    this.entityComponents.set(id, entityComponent);
  }

  addEntity(id: number, type: string) {
    const entity = this.getDefaultEntity(id, type);
    this.entities.push(entity);
  }

  getDefaultEntity(id: number, type: string) {
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

    return { id, type, fields, relations };
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
    this.deletedEntityId$.next(id);
    if (this.activeEntity.getValue()?.id === id) {
      this.activeEntity.next(undefined);
    }
  }

  onRemoveEntity(): Observable<number> {
    return this.deletedEntityId$.asObservable();
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
    this.checkField(id, field, value);
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

  checkField(id: number, field: string, value: FieldValue): void {
    if (typeof value !== 'string') return;
    const key = `${field}-${id}`;
    if (value.trim() === '') {
      this.errorsService.addStateError(`${id}: field "${field}" can't be empty`, key);
    } else {
      this.errorsService.removeStateError(key);
    }
  }

  tryConnectIds(id1: number, id2: number): boolean {
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
      this.addRelation(id1, id2);
      return true;
    }
    if (referenceField2) {
      entity2.relations[referenceField2.name].push(entity1.id);
      this.addRelation(id1, id2);
      return true;
    }
    return false;
  }

  removeAllRelations(id: number) {
    const entity = this.entities.find(e => e.id === id);
    if (!entity) throw new Error('There is no entity with provided id');
    for (const relation in entity.relations) {
      entity.relations[relation] = [];
    }
    for (const e of this.entities) {
      for (const relation in e.relations) {
        e.relations[relation] = e.relations[relation].filter(entityId => entityId !== id);
      }
    }
    for (const relation of this.relations) {
      if (relation.id1 === id || relation.id2 === id) {
        this.linesCreatorService.removeLine(relation.line$);
      }
    }
    this.relations = this.relations.filter(relation => relation.id1 !== id && relation.id2 !== id);
  }

  addRelation(id1: number, id2: number) {
    const entity1 = this.entityComponents.get(id1);
    const entity2 = this.entityComponents.get(id2);
    if (!entity1 || !entity2) throw new Error('There is no entity with provided id');
    const line$ = combineLatest({
      x1: entity1.x,
      y1: entity1.y,
      x2: entity2.x,
      y2: entity2.y,
    }).pipe(map(line => {
      return {
        x1: line.x1 + entity1.halfWidth,
        y1: line.y1 + entity1.halfHeight,
        x2: line.x2 + entity2.halfWidth,
        y2: line.y2 + entity2.halfHeight,
      };
    }));
    this.linesCreatorService.addLine(line$);
    this.relations.push({ id1, id2, line$ });
  }

  addExportedEntity(exportedEntity: EntityExported) {
    const entityDefault = this.getDefaultEntity(exportedEntity.id, exportedEntity.type);
    const fieldsRaw = JSON.parse(exportedEntity.fields) as Record<string, FieldValue | number[]>;
    const fields: Record<string, BehaviorSubject<FieldValue>> = {};
    const relations: Record<string, number[]> = {};
    for (const key in fieldsRaw) {
      const field = fieldsRaw[key];
      if (Array.isArray(field)) {
        relations[key] = field;
      } else {
        fields[key] = new BehaviorSubject(field);
      }
    }
    const entity: Entity = {
      id: exportedEntity.id,
      type: exportedEntity.type,
      fields: { ...entityDefault.fields, ...fields },
      relations: { ...entityDefault.relations, ...relations },
    };
    this.idGenerator.trySetMaxId(exportedEntity.id);
    const entityComponent = this.entityComponents.get(entity.id);
    if (!entityComponent) throw new Error('There is no entity with provided id');
    entityComponent.setCoords(exportedEntity.x, exportedEntity.y);
    this.entities.push(entity);
    for (const field in entity.fields) {
      this.checkField(exportedEntity.id, field, entity.fields[field].getValue());
    }
    if (this.entities.length === this.initEntitiesLength) {
      this.restoreRelations();
    }
  }

  init(projectId: number, entitiesLength: number) {
    this.projectId = projectId;
    this.initEntitiesLength = entitiesLength;
  }

  restoreRelations() {
    for (const entity of this.entities) {
      for (const key in entity.relations) {
        for (const i of entity.relations[key]) {
          this.addRelation(entity.id, i);
        }
      }
    }
  }

  exportEntities(): EntityExported[] {
    return this.entities.map(e => this.getExportedEntity(e));
  }

  getExportedEntity(entity: Entity): EntityExported {
    const entityComponent = this.entityComponents.get(entity.id);
    if (!entityComponent) throw new Error('There is no entity with provided id');
    const fields: Record<string, FieldValue | number[]> = {};
    for (const key in entity.fields) {
      fields[key] = entity.fields[key].getValue();
    }
    for (const key in entity.relations) {
      fields[key] = entity.relations[key];
    }
    return {
      id: entity.id,
      projectId: this.projectId,
      type: entity.type,
      x: entityComponent.currX,
      y: entityComponent.currY,
      fields: JSON.stringify(fields),
    };
  }

  getConfig(type: string): unknown[] {
    return this.entities
      .filter(x => x.type === type)
      .map(e => {
        const fields: Record<string, FieldValue> = {};
        for (const key in e.fields) {
          let value = e.fields[key].getValue();
          if (isAPIConfig(value)) {
            value = this.fixApiConfig(value);
          }
          fields[key] = value;
        }
        return {
          id: e.id,
          ...fields,
          ...e.relations,
        };
      });
  }

  fixApiConfig(config: APIConfig): APIConfig {
    for (const endpointGroup of config.endpointGroups) {
      for (const endpoint of endpointGroup.endpoints) {
        endpoint.request.content.type = this.toEntityRef(endpoint.request.content.type);
        const requestItems = endpoint.request.content.items;
        if (requestItems) {
          if (typeof requestItems === 'string') {
            endpoint.request.content.items = { type: this.toEntityRef(requestItems) };
          }
        }
        endpoint.response.content.type = this.toEntityRef(endpoint.response.content.type);
        const responseItems = endpoint.response.content.items;
        if (responseItems) {
          if (typeof responseItems === 'string') {
            endpoint.response.content.items = { type: this.toEntityRef(responseItems) };
          }
        }
      }
      for (const entity of endpointGroup.entities) {
        for (const field of entity.fields) {
          field.type = this.toEntityRef(field.type);
          const items = field.items;
          if (items) {
            if (typeof items === 'string') {
              field.items = { type: this.toEntityRef(items) };
            }
          }
        }
      }
    }
    return config;
  }

  toEntityRef(value: string | EntityRef): string | EntityRef {
    if (typeof value === 'string') {
      if (!isNaN(parseInt(value))) {
        const id = parseInt(value);
        return { id };
      }
    }
    return value;
  }
}
