import { GetQueryBuilder } from '../../libs/knex/query-builder';
import { Clock } from '../../system/clock/clock';
import {
  getUserId,
  GetUserIdFn,
} from '../../system/context/get-current-user-id';
import { DBInsertError } from '../../system/errors/db-insert.error';
import {
  ArchiveTraceableDBEntity,
  traceableInjectors,
  UpdateTraceableDBEntity,
} from '../../system/tracing/traceable.db-entity';
import {
  ArchiveTraceable,
  CreateTraceable,
  UpdateTraceable,
} from '../../system/tracing/traceable.model';
import { Organization } from '../models/organization.model';
import {
  OrganizationDBEntity,
  organizationDBMappers,
} from './db-entities/organization.db-entity';

type Deps = {
  getQueryBuilder: GetQueryBuilder<OrganizationDBEntity>;
  clock: Clock;
  getUserId: GetUserIdFn;
};

export type InsertOrganization = Omit<
  Organization,
  'id' | keyof CreateTraceable | keyof UpdateTraceable | keyof ArchiveTraceable
>;

export type InsertOrganizationFn = ReturnType<typeof makeInsertOrganization>;

export function makeInsertOrganization(deps: Deps) {
  return async function insertOrganization(
    model: InsertOrganization
  ): Promise<Organization> {
    const toInsert: Omit<
      OrganizationDBEntity,
      'id' | keyof UpdateTraceableDBEntity | keyof ArchiveTraceableDBEntity
    > = {
      name: model.name,
      slug: model.slug,
      logo_url: model.logoUrl,
      locales: {
        locales: Array.from(model.locales),
      },
      ...traceableInjectors.injectCreateFields(deps.clock, getUserId),
    };

    const qb = deps.getQueryBuilder();

    const rows = await qb.insert(toInsert).returning('*');

    if (rows.length === 0) {
      throw new DBInsertError('Organization');
    }

    return organizationDBMappers.toModel(rows[0]);
  };
}
