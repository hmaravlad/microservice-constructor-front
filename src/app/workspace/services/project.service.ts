import { Injectable } from '@angular/core';
import { ProjectFull } from 'src/app/projects/project.entity';
import { FieldDescription } from '../types/field-description';
import { FieldValue } from '../types/field-type';
import { ProjectExported } from '../types/project-exported';
import { EntityDescriptionProviderService } from './entity-description-provider.service';
import { EntityService } from './entity.service';
import { ErrorsService } from './errors.service';
import { ProjectDescriptionProviderService } from './project-description-provider.service';

@Injectable()
export class ProjectDataService {
  constructor(
    private projectDescriptionProviderService: ProjectDescriptionProviderService,
    private entityDescriptionProviderService: EntityDescriptionProviderService,
    private entityService: EntityService,
    private errorsService: ErrorsService,
  ) { }

  fields: Record<string, FieldValue> = {};
  name: string;

  init(project: ProjectFull) {
    const fields = this.projectDescriptionProviderService.getProjectDescription().fields;
    for (const field of fields) {
      this.setField(field.name, this.getDefaultValue(field));
    }
    this.name = project.name;
    const existingFields = JSON.parse(project.fields);
    this.fields = { ...this.fields, ...existingFields };
    for (const field in this.fields) {
      this.checkField(field, this.fields[field]);
    }
  }

  export(): ProjectExported {
    return {
      name: this.name,
      fields: JSON.stringify({ name: this.name, ...this.fields }),
    };
  }
  setField(field: string, value: FieldValue) {
    this.fields[field] = value;
    this.checkField(field, value);
  }

  getField(field: string): FieldValue {
    const value = this.fields[field];
    if (value === undefined) throw Error('Invalid field');
    return value;
  }

  checkField(field: string, value: FieldValue): void {
    if (typeof value !== 'string') return;
    const key = `project-${field}`;
    if (value.trim() === '') {
      this.errorsService.addStateError(`Project: field "${field}" can't be empty`, key);
    } else {
      this.errorsService.removeStateError(key);
    }
  }

  getDefaultValue(field: FieldDescription): FieldValue {
    const defaultType: Record<string, FieldValue> = {
      'number': 1,
      'string': '',
      'boolean': false,
      'enum': field.possibleValues ? field.possibleValues[0] : '',
    };
    const value = defaultType[field.type];
    if (value === undefined) throw new Error('Invalid field type');
    return value;
  }

  getFullConfig(): {
    name: string,
    data: string,
  } {
    const project: Record<string, unknown> = {
      name: this.name,
      ...this.fields,
    };
    const entities = this.entityDescriptionProviderService.getEntityDescription();
    for (const entity of entities) {
      project[entity.fieldName] = this.entityService.getConfig(entity.name);
    }
    return {
      name: this.name,
      data: JSON.stringify(project, null, ' '),
    };
  }
}
