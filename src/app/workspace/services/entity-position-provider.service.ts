import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EntityComponent } from '../components/entity/entity.component';


@Injectable({
  providedIn: 'root',
})
export class EntityPositionProviderService {
  mouseInsideEntityMap = new Map<EntityComponent, boolean>();

  observeEntity(
    entity: EntityComponent, 
    mouseEnter$: Observable<MouseEvent>, 
    mouseLeave$: Observable<MouseEvent>,
  ) {
    this.mouseInsideEntityMap.set(entity, false);
    mouseEnter$.subscribe(() => {
      this.mouseInsideEntityMap.set(entity, true);
    });
    mouseLeave$.subscribe(() => {
      this.mouseInsideEntityMap.set(entity, false);
    });
  }

  checkIfInside(): undefined | EntityComponent {
    for (const [entity, isMouseInside] of this.mouseInsideEntityMap) {
      if (isMouseInside) return entity;
    }
    return undefined;
  }
}
