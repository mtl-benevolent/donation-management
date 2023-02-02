import {
  ArchiveTraceableDBEntity,
  CreateTraceableDBEntity,
  traceableDBMappers,
  UpdateTraceableDBEntity,
} from '../../../system/tracing/traceable.db-entity';
import { Organization } from '../../models/organization.model';

export type OrganizationDBEntity = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  locales: {
    locales: string[];
  };
} & CreateTraceableDBEntity &
  UpdateTraceableDBEntity &
  ArchiveTraceableDBEntity;

export const organizationDBMappers = {
  toModel: (dbEntity: OrganizationDBEntity): Organization => ({
    id: dbEntity.id,
    name: dbEntity.name,
    slug: dbEntity.slug,
    logoUrl: dbEntity.logo_url,
    locales: new Set(dbEntity.locales.locales ?? []),

    ...traceableDBMappers.toCreateModel(dbEntity),
    ...traceableDBMappers.toUpdateModel(dbEntity),
    ...traceableDBMappers.toArchiveModel(dbEntity),
  }),
};
