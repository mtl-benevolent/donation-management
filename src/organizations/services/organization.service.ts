import { organizationRepository } from '../repositories/organization.repository';
import { makeCreateOrganization } from './create-organization';
import { makeGetOrganization } from './get-organization';

export const organizationService = {
  get: makeGetOrganization({
    findOrganization: organizationRepository.findOrganization,
  }),
  create: makeCreateOrganization({
    insertOrganization: organizationRepository.insertOrganization,
  }),
};
