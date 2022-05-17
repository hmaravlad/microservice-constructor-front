import { BehaviorSubject } from 'rxjs';
import { FieldValue } from './field-type';

export interface Entity {
  id: number;
  type: string;
  fields: Record<string, BehaviorSubject<FieldValue>>;
  relations: Record<string, number[]>;
}
