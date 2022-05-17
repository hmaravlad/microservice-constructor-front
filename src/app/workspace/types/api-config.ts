export class APIConfig {
  endpointGroups: EndpointGroup[];
}

export class EndpointGroup {
  name: string;

  prefix: string;

  endpoints: Endpoint[];

  entities: Entity[];
}

export class Endpoint {
  name: string;

  path: string;

  method: string;

  request: Exchange;

  response: Exchange;
}

export class Entity {
  id: number;

  name: string;

  fields: Field[];
}

export class Value {
  type: string | EntityRef;

  items?: Value;
}

export class Field extends Value {
  name: string;
}

export class Exchange {
  statusCode?: number;

  content: Value;
}

export class EntityRef {
  id: number;
}

export function isEntityRef(obj: unknown): obj is EntityRef {
  return (obj as EntityRef).id !== undefined;
}

export function isValue(obj: unknown): obj is Value {
  return (obj as Value).type !== undefined;
}