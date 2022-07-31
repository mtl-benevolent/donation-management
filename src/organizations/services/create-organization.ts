import { Organization, OrganizationData } from '../models/organization.model';
import { InsertOrganizationFn } from '../repositories/insert-organization';

type Deps = {
  insertOrganization: InsertOrganizationFn;
};

export function makeCreateOrganization(deps: Deps) {
  return async function createOrganization(
    entity: OrganizationData
  ): Promise<Organization> {
    const organization = await deps.insertOrganization(entity);
    return organization;
  };
}