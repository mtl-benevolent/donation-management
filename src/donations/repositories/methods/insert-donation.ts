import { GetQueryBuilder } from '../../../libs/knex/query-builder';
import { Clock } from '../../../system/clock/clock';
import { GetContextValueFn } from '../../../system/context/create-context';
import { UserInfo } from '../../../system/context/user-info';
import { DBInsertError } from '../../../system/errors/db-insert.error';
import {
  ArchiveTraceableDBEntity,
  traceableInjectors,
} from '../../../system/tracing/traceable.db-entity';
import {
  ArchiveTraceable,
  CreateTraceable,
} from '../../../system/tracing/traceable.model';
import { Donation } from '../../models/donation.model';
import {
  DonationDBEntity,
  DonationDBMappers,
} from '../db-entities/donation.db-entity';
import {
  InsertDonationEntriesFn,
  InsertDonationEntry,
} from './insert-donation-entry';

type Deps = {
  clock: Clock;
  getUserInfo: GetContextValueFn<UserInfo>;
  getQueryBuilder: GetQueryBuilder<DonationDBEntity>;
  insertDonationEntries: InsertDonationEntriesFn;
};

export type InsertDonationFn = ReturnType<typeof makeInsertDonation>;

export type InsertDonation = Omit<
  Donation,
  'id' | 'donationEntries' | keyof CreateTraceable | keyof ArchiveTraceable
> & { donationEntries: InsertDonationEntry[] };

export function makeInsertDonation(deps: Deps) {
  return async function insertDonation(
    toInsert: InsertDonation
  ): Promise<Donation> {
    const dbEntity = toInsertDBEntity(toInsert);

    const qb = await deps.getQueryBuilder();
    const rows = await qb().insert(dbEntity).returning('*');

    if (rows.length !== 1) {
      throw new DBInsertError('Donation');
    }

    const donationEntries = await deps.insertDonationEntries(
      toInsert.donationEntries
    );

    return {
      ...DonationDBMappers.toModel(rows[0]),
      donationEntries,
    };
  };

  function toInsertDBEntity(
    insertModel: InsertDonation
  ): Omit<DonationDBEntity, 'id' | keyof ArchiveTraceableDBEntity> {
    return {
      organization_id: insertModel.organizationId,
      external_id: insertModel.externalId,
      environment: insertModel.environment,

      fiscal_year: insertModel.fiscalYear,
      reason: insertModel.reason,
      type: insertModel.type,

      currency: insertModel.currency,
      source: insertModel.source,

      donor_first_name: insertModel.donor.firstName,
      donor_last_name_or_org_name: insertModel.donor.lastNameOrOrgName,
      donor_email: insertModel.donor.email,
      donor_address: insertModel.donor.address,

      options_email_receipt: insertModel.options.emailReceipt,
      options_emit_receipt: insertModel.options.emitReceipt,

      ...traceableInjectors.injectCreateFields(deps.clock, deps.getUserInfo),
    };
  }
}
