import { GetQueryBuilder } from '../../libs/knex/query-builder';
import { DecryptFn } from '../../system/encryption/decrypt';
import { EntityNotFoundError } from '../../system/errors/entity-not-found.error';
import { traceDBFields } from '../../system/tracing/traceable.db-entity';
import { sqlUtils } from '../../utils/sql/sql.utils';
import { Organization } from '../models/organization.model';
import {
  OrganizationDBEntity,
  organizationDBMappers,
} from './db-entities/organization.db-entity';

type Deps = {
  decrypt: DecryptFn;
  getQueryBuilder: GetQueryBuilder<OrganizationDBEntity>;
};

export type FindOrganizationFn = ReturnType<typeof makeFindOrganization>;

export type FindOrganizationParams = {
  includeArchived?: boolean;
  includeSmtpPassword?: boolean;
  oneOf: {
    organizationId?: string;
    slug?: string;
  };
};

export function makeFindOrganization(deps: Deps) {
  return async function findOrganization(
    params: FindOrganizationParams
  ): Promise<Organization | null> {
    const qb = deps.getQueryBuilder();

    const query = qb
      .select(
        sqlUtils.selectAlias<OrganizationDBEntity>('organizations', [
          'id',
          'name',
          'slug',
          'logo_url',
          'locales',
          'smtp_settings',
          ...traceDBFields.create,
          ...traceDBFields.update,
          ...traceDBFields.archive,
        ])
      )
      .first();

    if (!params.includeArchived) {
      query.whereNull('organizations.archived_at');
    }

    if (params.oneOf.organizationId) {
      query.where('organizations.id', params.oneOf.organizationId);
    } else if (params.oneOf.slug) {
      query.where('organizations.slug', params.oneOf.slug);
    } else {
      throw new Error('No filter selected');
    }

    const result = await query;

    if (!result) {
      return null;
    }

    const dbEntity = sqlUtils.extractEntity<OrganizationDBEntity>(
      result,
      'organizations'
    );

    return organizationDBMappers.toModel(
      dbEntity,
      params.includeSmtpPassword ? deps.decrypt : undefined
    );
  };
}
