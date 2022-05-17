export interface FieldDescription {
  name: string;
  type: string;
  isId?: boolean;
  possibleValues?: string[];
  references?: string[];
}
