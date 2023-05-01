import { clock } from '@/system/clock/clock';
import { contexts } from '@/system/context/context';
import { DB } from '@/system/db/tables.config';
import { makeFindOneOrganization } from './methods/find-one-organization';
import { makeInsertOrganization } from './methods/insert-organization';

export const OrganizationRepository = {
  findOne: makeFindOneOrganization({
    getQueryBuilder: DB.organizations.getQueryBuilder,
  }),
  insertOne: makeInsertOrganization({
    clock,
    getUserInfo: contexts.userInfo.getValue,
    getQueryBuilder: DB.organizations.getQueryBuilder,
  }),
};
