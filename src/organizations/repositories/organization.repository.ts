import { getKnex } from '../../libs/knex/bootstrap';
import { GetQueryBuilder } from '../../libs/knex/query-builder';
import { Organization } from '../models/organization.model';
import { makeFindOrganizationById } from './find-organization-by-id';
import { makeFindOrganizationBySlug } from './find-organization-by-slug';

const getQueryBuilder: GetQueryBuilder<Organization> = () => {
  return getKnex().table<Organization>('organizations');
};

export type OrganizationRepository = typeof organizationRepository;

export const organizationRepository = {
  findOrganizationById: makeFindOrganizationById(getQueryBuilder),
  findOrganizationBySlug: makeFindOrganizationBySlug(getQueryBuilder),
};
