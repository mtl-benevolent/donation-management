import { isEmpty } from 'lodash';
import { GetQueryBuilder } from '../../../libs/knex/query-builder';
import { DB } from '../../../system/db/tables.config';
import { traceDBFields } from '../../../system/tracing/traceable.db-entity';
import { Donation, DonationSource } from '../../models/donation.model';
import { DonationEntryDBMappers } from '../db-entities/donation-entry.db-entity';
import {
  DonationDBEntity,
  DonationDBMappers,
} from '../db-entities/donation.db-entity';

export type Deps = {
  getQueryBuilder: GetQueryBuilder<DonationDBEntity>;
};

type FindOneDonationParams = {
  oneOf: {
    id?: string;
    externalId?: string;
  };

  source?: DonationSource;
  organizationId?: string;
  includeArchived?: boolean;
};

export function makeFindOneDonation(deps: Deps) {
  return async function findOneDonation(
    params: FindOneDonationParams
  ): Promise<Donation | null> {
    if (isEmpty(params.oneOf)) {
      throw new Error('No filters set to find Donation');
    }

    const qb = await deps.getQueryBuilder();

    const rows = await qb()
      .select({
        ...DB.donations.selectAlias([
          'id',
          'organization_id',
          'external_id',
          'environment',
          'fiscal_year',
          'reason',
          'type',
          'currency',
          'source',
          'donor_first_name',
          'donor_last_name_or_org_name',
          'donor_email',
          'donor_address',
          'options_email_receipt',
          'options_emit_receipt',
          ...traceDBFields.create,
          ...traceDBFields.archive,
        ]),
        ...DB.donationEntries.selectAlias([
          'id',
          'donation_id',
          'external_id',
          'amount',
          'receipt_amount',
          'received_at',
          ...traceDBFields.create,
          ...traceDBFields.archive,
        ]),
      })
      .leftOuterJoin(
        DB.donationEntries.tableName,
        DB.donationEntries.getField('donation_id'),
        DB.donations.getField('id')
      )
      .where((qb) => {
        if (params.oneOf.id) {
          qb.where(DB.donations.getField('id'), params.oneOf.id);
        }

        if (params.oneOf.externalId) {
          qb.where(
            DB.donations.getField('external_id'),
            params.oneOf.externalId
          );
        }

        if (params.source) {
          qb.where(DB.donations.getField('source'), params.source);
        }

        if (params.organizationId) {
          qb.where(
            DB.donations.getField('organization_id'),
            params.organizationId
          );
        }

        if (!params.includeArchived) {
          qb.whereNull(DB.donations.getField('archived_at'));
          qb.whereNull(DB.donationEntries.getField('archived_at'));
        }
      });

    if (rows.length === 0) {
      return null;
    }

    const donation = DB.donations.extractEntity(rows[0]);
    const donationEntries = DB.donationEntries.extractEntities(rows);

    return {
      ...DonationDBMappers.toModel(donation),
      donationEntries: donationEntries.map(DonationEntryDBMappers.toModel),
    };
  };
}
