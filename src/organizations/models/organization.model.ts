import {
  ArchiveTraceable,
  CreateTraceable,
  UpdateTraceable,
} from '../../system/tracing/traceable.model';

export type SmtpSettings = {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  from: string | null;
  replyTo: string | null;
};

export type OrganizationData = {
  name: string;
  slug: string;
  logoUrl: string | null;
  locales: Set<string>;
  smtpSettings: SmtpSettings | null;
};

export type Organization = OrganizationData & {
  id: string;
} & CreateTraceable &
  UpdateTraceable &
  ArchiveTraceable;
