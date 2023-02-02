import { getKnex } from '../../libs/knex/bootstrap';
import { GetQueryBuilder } from '../../libs/knex/query-builder';
import { clock } from '../../system/clock/clock';
import { getUserId } from '../../system/context/get-current-user-id';
import { OrganizationDBEntity } from './db-entities/organization.db-entity';
import { makeFindOrganization } from './find-organization';
import { makeInsertOrganization } from './insert-organization';

const getQueryBuilder: GetQueryBuilder<OrganizationDBEntity> = () => {
  return getKnex().table<OrganizationDBEntity>('organizations');
};

export const organizationRepository = {
  findOrganization: makeFindOrganization({
    getQueryBuilder,
  }),
  insertOrganization: makeInsertOrganization({
    clock,
    getUserId,
    getQueryBuilder,
  }),
};
