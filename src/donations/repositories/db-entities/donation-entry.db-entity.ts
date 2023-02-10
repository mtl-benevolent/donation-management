import {
  ArchiveTraceableDBEntity,
  CreateTraceableDBEntity,
  traceableDBMappers,
} from '../../../system/tracing/traceable.db-entity';
import { DonationEntry } from '../../models/donation-entry.model';

export type DonationEntryDBEntity = {
  id: string;
  donation_id: string;
  external_id: string | null;

  amount: string;
  receipt_amount: string;

  received_at: Date;
} & CreateTraceableDBEntity &
  ArchiveTraceableDBEntity;

export const DonationEntryDBMappers = {
  toModel: (dbEntity: DonationEntryDBEntity): DonationEntry => {
    return {
      id: dbEntity.id,
      externalId: dbEntity.external_id,
      amount: BigInt(dbEntity.amount),
      receiptAmount: BigInt(dbEntity.receipt_amount),
      receivedAt: dbEntity.received_at,

      ...traceableDBMappers.toCreateModel(dbEntity),
      ...traceableDBMappers.toArchiveModel(dbEntity),
    };
  },
};
