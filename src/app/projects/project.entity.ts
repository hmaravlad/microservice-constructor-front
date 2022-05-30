import { EntityExported } from '../workspace/types/entity-exported';

export interface Project {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectFull extends Project {
  fields: string;
  entities: EntityExported[];
}