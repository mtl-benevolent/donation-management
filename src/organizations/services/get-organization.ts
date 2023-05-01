import { EntityNotFoundError } from '@/system/errors/entity-not-found.error';
import { Organization } from '../models/organization.model';
import {
  FindOneOrganizationFn,
  FindOneOrganizationParams,
} from '../repositories/methods/find-one-organization';

type Deps = {
  findOrganization: FindOneOrganizationFn;
};

export type GetOrganizationParams =
  | { organizationId: string }
  | { slug: string };

export function makeGetOrganization(deps: Deps) {
  return async function getOrganization(
    params: GetOrganizationParams
  ): Promise<Organization> {
    const findParams: FindOneOrganizationParams = {
      includeArchived: false,
      oneOf: {},
    };

    if ('organizationId' in params) {
      findParams.oneOf.organizationId = params.organizationId;
    } else if ('slug' in params) {
      findParams.oneOf.slug = params.slug;
    }

    const maybeOrganization = await deps.findOrganization(findParams);

    if (!maybeOrganization) {
      throw new EntityNotFoundError(
        'Organization',
        findParams.oneOf.organizationId,
        { field: 'slug', value: findParams.oneOf.slug },
        { field: 'includeArchived', value: false }
      );
    }

    return maybeOrganization;
  };
}
