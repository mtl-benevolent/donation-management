import Router from '@koa/router';
import { EntityNotFoundError } from '../../system/errors/entity-not-found.error';
import { OrganizationData, SmtpSettings } from '../models/organization.model';
import { organizationService } from '../services/organization.service';
import { organizationDTOMappers } from './dtos/organization.dto';
import { smtpSettingsDTOMappers } from './dtos/smtp-settings.dto';

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

    ctx.response.body = organizationDTOMappers.toDTO(organization);
  });

  organizationController.post('/', async (ctx) => {
    // TODO: Validate request body
    const orgData: OrganizationData = organizationDTOMappers.toOrgDataModel(
      ctx.request.body
    );

    const created = await organizationService.create(orgData);

    ctx.response.body = created;
    ctx.response.status = 201;
  });

  // SMTP Settings
  organizationController.get('/:slug/smtp-settings', async (ctx) => {
    const slug = ctx.params.slug;

    const organization = await organizationService.get({
      includeSmtpPassword: false,
      slug,
    });

    if (!organization.smtpSettings) {
      throw new EntityNotFoundError('SmtpSettings', null, {
        field: 'slug',
        value: slug,
      });
    }

    ctx.response.body = smtpSettingsDTOMappers.toDTO(organization.smtpSettings);
  });

  // TODO: Implement update organization SMTP Settings

  return organizationController;
}
