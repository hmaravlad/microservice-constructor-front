import { FieldDescription } from './field-description';

export interface EntityDescription {
  name: string;
  fieldName: string;
  fields: FieldDescription[];
}
