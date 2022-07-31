import Router from '@koa/router';
import { OrganizationData } from '../models/organization.model';
import { organizationService } from '../services/organization.service';

export function createOrganizationController(): Router {
  const organizationController = new Router({
    prefix: '/organizations',
  });

  organizationController.get('/:slug', async (ctx) => {
    const slug = ctx.params.slug;

    const organization = await organizationService.get({
      includeSmtpPassword: false,
      slug,
    });

    // TODO: Map to DTO
    ctx.response.body = organization;
  });

  organizationController.post('/', async (ctx) => {
    // TODO: Validate body
    const requestDTO: OrganizationData = ctx.request.body;

    const created = await organizationService.create(requestDTO);

    ctx.response.body = created;
    ctx.response.status = 201;
  });

  return organizationController;
}
