import { Environment } from '../../../models/environment.enum';
import {
  ArchiveTraceableDBEntity,
  CreateTraceableDBEntity,
} from '../../../system/tracing/traceable.db-entity';
import {
  Address,
  Donation,
  DonationSource,
  DonationType,
} from '../../models/donation.model';

export type DonationDBEntity = {
  id: string;
  organization_id: string;
  external_id: string | null;
  environment: Environment;

  fiscal_year: number;
  reason: string | null;
  type: DonationType;
  currency: string;
  source: DonationSource;

  donor_first_name: string | null;
  donor_last_name_or_org_name: string;
  donor_email: string | null;
  donor_address: Address | null;

  options_emit_receipt: boolean;
  options_email_receipt: boolean;
} & CreateTraceableDBEntity &
  ArchiveTraceableDBEntity;

export const DonationDBMappers = {
  toModel: (dbEntity: DonationDBEntity): Donation => {
    return {
      id: dbEntity.id,
      organizationId: dbEntity.organization_id,
      externalId: dbEntity.external_id,
      environment: dbEntity.environment,

      fiscalYear: dbEntity.fiscal_year,
      reason: dbEntity.reason,
      type: dbEntity.type,
      currency: dbEntity.currency,
      source: dbEntity.source,

      donor: {
        firstName: dbEntity.donor_first_name,
        lastNameOrOrgName: dbEntity.donor_last_name_or_org_name,
        email: dbEntity.donor_email,
        address: dbEntity.donor_address,
      },

      options: {
        emailReceipt: dbEntity.options_email_receipt,
        emitReceipt: dbEntity.options_emit_receipt,
      },

      donationEntries: [],
    };
  },
};
