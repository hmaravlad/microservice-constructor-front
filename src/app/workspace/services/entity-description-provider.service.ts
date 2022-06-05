import { Injectable } from '@angular/core';
import { EntityDescription } from '../types/entity-description';
import { getEntitiesData } from 'microservice-constructor';

@Injectable({
  providedIn: 'root',
})
export class EntityDescriptionProviderService {
  private entities = getEntitiesData();
  getEntityDescription(): EntityDescription[] {
    return this.entities;
  }
}
