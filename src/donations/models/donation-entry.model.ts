import {
  ArchiveTraceable,
  CreateTraceable,
} from '../../system/tracing/traceable.model';

export type DonationEntry = {
  id: string;
  externalId: string | null;

  amount: BigInt;
  receiptAmount: BigInt;

  receivedAt: Date;
} & CreateTraceable &
  ArchiveTraceable;
