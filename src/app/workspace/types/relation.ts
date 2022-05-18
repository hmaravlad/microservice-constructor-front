import { Observable } from 'rxjs';
import { Line } from './line';

export interface Relation {
  id1: number;
  id2: number;
  line$: Observable<Line>
}