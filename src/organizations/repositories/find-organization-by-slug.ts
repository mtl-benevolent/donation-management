import { GetQueryBuilder } from '../../libs/knex/query-builder';
import { EntityNotFoundError } from '../../system/errors/entity-not-found.error';
import { Organization } from '../models/organization.model';

export function makeFindOrganizationBySlug(
  getQb: GetQueryBuilder<Organization>
) {
  return async function findOrganizationBySlug(
    slug: string
  ): Promise<Organization> {
    const qb = getQb();

    const result = await qb.select('*').where({
      slug,
    });

    if (!result) {
      throw new EntityNotFoundError('Organization', null, {
        field: 'slug',
        value: slug,
      });
    }

    return result;
  };
}
