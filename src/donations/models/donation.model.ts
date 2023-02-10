import { Environment } from '../../models/environment.enum';
import { createEnums } from '../../utils/enums/enums.utils';
import { DonationEntry } from './donation-entry.model';

export type DonationType = 'oneTime' | 'recurrent';
export const DonationTypes = createEnums<DonationType>('oneTime', 'recurrent');

export type DonationSource =
  | 'paypal'
  | 'cheque'
  | 'directDeposit'
  | 'stocks'
  | 'other';

export const DonationSources = createEnums<DonationSource>(
  'paypal',
  'cheque',
  'directDeposit',
  'stocks',
  'other'
);

export type Donation = {
  id: string;
  organizationId: string;
  externalId: string | null;
  environment: Environment;

  fiscalYear: number;
  reason: string | null;
  type: DonationType;
  currency: string;
  source: DonationSource;

  donor: Donor;

  options: DonationOptions;

  donationEntries: DonationEntry[];
};

export type Donor = {
  firstName: string | null;
  lastNameOrOrgName: string;
  email: string | null;
  address: Address | null;
};

export type Address = {
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  state: string | null;
  country: string | null;
};

export type DonationOptions = {
  emitReceipt: boolean;
  emailReceipt: boolean;
};
