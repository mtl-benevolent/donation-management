import Router from '@koa/router';
import { unitOfWork } from '../../libs/koa/unit-of-work/unit-of-work.middleware';
import {
  validateBody,
  validateParam,
  validateResponse,
} from '../../libs/koa/validation/validate.middleware';
import { organizationService } from '../services/organization.service';
import { organizationDTOMappers } from './dtos/organization.dto';
import {
  CreateOrganizationRequest,
  organizationContracts,
} from './organization.contracts';

export function createOrganizationController(): Router {
  const organizationController = new Router({
    prefix: '/organizations',
  });

  organizationController.get(
    '/:slug',
    validateParam('slug', organizationContracts.params.slug),
    validateResponse(organizationContracts.responses.organizationDTO),
    async (ctx) => {
      const slug = ctx.params.slug;

      const organization = await organizationService.get({
        slug,
      });

      ctx.response.body = organizationDTOMappers.toDTO(organization);
    }
  );

  organizationController.post(
    '/',
    validateBody(organizationContracts.requests.create),
    validateResponse(organizationContracts.responses.organizationDTO),
    unitOfWork(),
    async (ctx) => {
      const request = ctx.request.body as CreateOrganizationRequest;

      const created = await organizationService.create({
        name: request.name,
        slug: request.slug,
        logoUrl: request.logoUrl,
        locales: new Set(request.locales),
      });

      ctx.response.body = organizationDTOMappers.toDTO(created);
      ctx.response.status = 201;
    }
  );

  return organizationController;
}
