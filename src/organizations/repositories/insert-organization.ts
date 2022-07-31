import { GetQueryBuilder } from '../../libs/knex/query-builder';
import { Clock } from '../../system/clock/clock';
import {
  getUserId,
  GetUserIdFn,
} from '../../system/context/get-current-user-id';
import { EncryptFn } from '../../system/encryption/encrypt';
import { DBInsertError } from '../../system/errors/db-insert.error';
import { traceableInjectors } from '../../system/tracing/traceable.db-entity';
import { Organization, OrganizationData } from '../models/organization.model';
import {
  OrganizationDBEntity,
  organizationDBMappers,
} from './db-entities/organization.db-entity';

type Deps = {
  encrypt: EncryptFn;
  getQueryBuilder: GetQueryBuilder<OrganizationDBEntity>;
  clock: Clock;
  getUserId: GetUserIdFn;
};

export type InsertOrganizationFn = ReturnType<typeof makeInsertOrganization>;

export function makeInsertOrganization(deps: Deps) {
  return async function insertOrganization(
    modelToInsert: OrganizationData
  ): Promise<Organization> {
    const toInsert = {
      ...organizationDBMappers.toInsert(modelToInsert, deps.encrypt),
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
