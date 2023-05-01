import { GetQueryBuilder } from '@/libs/knex/query-builder';
import { DB } from '@/system/db/tables.config';
import { traceDBFields } from '@/system/tracing/traceable.db-entity';
import { isEmpty } from 'lodash';
import { Organization } from '../../models/organization.model';
import {
  OrganizationDBEntity,
  OrganizationDBMappers,
} from '../db-entities/organization.db-entity';

type Deps = {
  getQueryBuilder: GetQueryBuilder<OrganizationDBEntity>;
};

export type FindOneOrganizationFn = ReturnType<typeof makeFindOneOrganization>;

export type FindOneOrganizationParams = {
  includeArchived?: boolean;
  oneOf: {
    organizationId?: string;
    slug?: string;
  };
};

export function makeFindOneOrganization(deps: Deps) {
  return async function findOneOrganization(
    params: FindOneOrganizationParams
  ): Promise<Organization | null> {
    if (isEmpty(params.oneOf)) {
      throw new Error('No filters set to find Donation');
    }

    const qb = await deps.getQueryBuilder();

    const query = qb()
      .select(
        DB.organizations.selectAlias([
          'id',
          'name',
          'slug',
          'logo_url',
          'locales',
          ...traceDBFields.create,
          ...traceDBFields.update,
          ...traceDBFields.archive,
        ])
      )
      .first();

    if (!params.includeArchived) {
      query.whereNull(DB.organizations.getField('archived_at'));
    }

    if (params.oneOf.organizationId) {
      query.where(DB.organizations.getField('id'), params.oneOf.organizationId);
    } else if (params.oneOf.slug) {
      query.where(DB.organizations.getField('slug'), params.oneOf.slug);
    } else {
      throw new Error('No filter selected');
    }

    const row = await query;

    if (!row) {
      return null;
    }

    const dbEntity = DB.organizations.extractEntity(row);
    return OrganizationDBMappers.toModel(dbEntity);
  };
}
