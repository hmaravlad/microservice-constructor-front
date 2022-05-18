import { Injectable } from '@angular/core';
import { FieldDescription } from '../types/field-description';
import { FieldValue } from '../types/field-type';
import { ProjectDescriptionProviderService } from './project-description-provider.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectDataService {
  constructor(private projectDescriptionProviderService: ProjectDescriptionProviderService) {}

  fields: Record<string, FieldValue> = {};

  init() {
    const fields = this.projectDescriptionProviderService.getProjectDescription().fields;
    for (const field of fields) {
      this.setField(field.name, this.getDefaultValue(field));
    }
  }

  setField(field: string, value: FieldValue) {
    this.fields[field] = value;
  }

  getField(field: string): FieldValue {
    const value = this.fields[field];
    if (value === undefined) throw Error('Invalid field');
    return value;
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
}
