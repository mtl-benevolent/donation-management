import {
  ArchiveTraceable,
  CreateTraceable,
  UpdateTraceable,
} from '../../system/tracing/traceable.model';

export type Organization = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  smtpSettings: {} | null;
} & CreateTraceable &
  UpdateTraceable &
  ArchiveTraceable;

export type CreateOrganization = Omit<
  Organization,
  'id' | keyof CreateTraceable | keyof UpdateTraceable | keyof ArchiveTraceable
>;
