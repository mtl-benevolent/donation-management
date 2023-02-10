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
import { DonationEntry } from '../../models/donation-entry.model';
import {
  DonationEntryDBEntity,
  DonationEntryDBMappers,
} from '../db-entities/donation-entry.db-entity';

type Deps = {
  clock: Clock;
  getUserInfo: GetContextValueFn<UserInfo>;
  getQueryBuilder: GetQueryBuilder<DonationEntryDBEntity>;
};

export type InsertDonationEntriesFn = ReturnType<
  typeof makeInsertDonationEntries
>;

export type InsertDonationEntry = Omit<
  DonationEntry,
  'id' | keyof CreateTraceable | keyof ArchiveTraceable
> & { donationId: string };

export function makeInsertDonationEntries(deps: Deps) {
  return async function insertDonationEntries(
    toInsert: InsertDonationEntry[]
  ): Promise<DonationEntry[]> {
    const dbEntities = toInsert.map(toInsertDBEntity);

    const qb = await deps.getQueryBuilder();
    const rows = await qb().insert(dbEntities).returning('*');

    if (rows.length !== toInsert.length) {
      throw new DBInsertError('DonationEntry');
    }

    return rows.map(DonationEntryDBMappers.toModel);
  };

  function toInsertDBEntity(
    insertModel: InsertDonationEntry
  ): Omit<DonationEntryDBEntity, 'id' | keyof ArchiveTraceableDBEntity> {
    return {
      donation_id: insertModel.donationId,
      external_id: insertModel.externalId,
      amount: insertModel.amount.toString(),
      receipt_amount: insertModel.receiptAmount.toString(),
      received_at: insertModel.receivedAt,

      ...traceableInjectors.injectCreateFields(deps.clock, deps.getUserInfo),
    };
  }
}
