import { GetQueryBuilder } from '../../libs/knex/query-builder';
import { EntityNotFoundError } from '../../system/errors/entity-not-found.error';
import { Organization } from '../models/organization.model';

export function makeFindOrganizationById(getQb: GetQueryBuilder<Organization>) {
  return async function findOrganizationById(
    organizationId: string
  ): Promise<Organization> {
    const qb = getQb();

    const result = await qb.select('*').where({
      id: organizationId,
    });

    if (!result) {
      throw new EntityNotFoundError('Organization', organizationId);
    }

    return result;
  };
}
