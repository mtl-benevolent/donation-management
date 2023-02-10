import { Organization } from '../models/organization.model';
import {
  InsertOrganization,
  InsertOrganizationFn,
} from '../repositories/methods/insert-organization';

type Deps = {
  insertOrganization: InsertOrganizationFn;
};

export function makeCreateOrganization(deps: Deps) {
  return async function createOrganization(
    entity: InsertOrganization
  ): Promise<Organization> {
    const organization = await deps.insertOrganization(entity);
    return organization;
  };
}
