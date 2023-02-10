import { OrganizationRepository } from '../repositories/organization.repository';
import { makeCreateOrganization } from './create-organization';
import { makeGetOrganization } from './get-organization';

export const organizationService = {
  get: makeGetOrganization({
    findOrganization: OrganizationRepository.findOne,
  }),
  create: makeCreateOrganization({
    insertOrganization: OrganizationRepository.insertOne,
  }),
};
