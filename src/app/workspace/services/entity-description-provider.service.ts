import { Injectable } from '@angular/core';
import { EntityDescription } from '../types/entity-description';

@Injectable({
  providedIn: 'root',
})
export class EntityDescriptionProviderService {
  getEntityDescription(): EntityDescription[] {
    return this.entities;
  }

  private entities: EntityDescription[] = [
    {
      name: 'gateway',
      fieldName: 'gateways',
      fields: [
        { name: 'id', type: 'number', isId: true },
        {
          name: 'serviceIds',
          type: 'number',
          references: [ 'service' ],
        },
        { name: 'hostname', type: 'string' },
      ],
    },
    {
      name: 'eventBus',
      fieldName: 'eventBuses',
      fields: [
        { name: 'id', type: 'number', isId: true },
        { name: 'type', type: 'enum', possibleValues: [ 'kafka' ] },
        { name: 'replicas', type: 'number' },
      ],
    },
    {
      name: 'service',
      fieldName: 'services',
      fields: [
        { name: 'id', type: 'number', isId: true },
        { name: 'name', type: 'string' },
        { name: 'lang', type: 'enum', possibleValues: [ 'ts-nest' ] },
        { name: 'port', type: 'number' },
        { name: 'docs', type: 'boolean' },
        { name: 'replicas', type: 'number' },
        {
          name: 'databaseIds',
          type: 'number',
          references: [ 'database' ],
        },
        {
          name: 'eventBusIds',
          type: 'number',
          references: [ 'eventBus' ],
        },
        { name: 'api', type: 'APIConfig' },
      ],
    },
    {
      name: 'database',
      fieldName: 'databases',
      fields: [
        { name: 'id', type: 'number', isId: true },
        { name: 'name', type: 'string' },
        {
          name: 'type',
          type: 'enum',
          possibleValues: [ 'postgres' ],
        },
        { name: 'sizeGb', type: 'number' },
      ],
    },
  ];
}
