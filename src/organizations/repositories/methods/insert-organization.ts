import { GetQueryBuilder } from '../../../libs/knex/query-builder';
import { Clock } from '../../../system/clock/clock';
import { GetContextValueFn } from '../../../system/context/create-context';
import { UserInfo } from '../../../system/context/user-info';
import { DBInsertError } from '../../../system/errors/db-insert.error';
import {
  ArchiveTraceableDBEntity,
  traceableInjectors,
  UpdateTraceableDBEntity,
} from '../../../system/tracing/traceable.db-entity';
import {
  ArchiveTraceable,
  CreateTraceable,
  UpdateTraceable,
} from '../../../system/tracing/traceable.model';
import { Organization } from '../../models/organization.model';
import {
  OrganizationDBEntity,
  OrganizationDBMappers,
} from '../db-entities/organization.db-entity';

type Deps = {
  getQueryBuilder: GetQueryBuilder<OrganizationDBEntity>;
  clock: Clock;
  getUserInfo: GetContextValueFn<UserInfo>;
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
      ...traceableInjectors.injectCreateFields(deps.clock, deps.getUserInfo),
    };

    const qb = await deps.getQueryBuilder();

    const rows = await qb().insert(toInsert).returning('*');

    if (rows.length === 0) {
      throw new DBInsertError('Organization');
    }

    return OrganizationDBMappers.toModel(rows[0]);
  };
}
