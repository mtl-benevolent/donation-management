import {
  ArchiveTraceable,
  CreateTraceable,
  UpdateTraceable,
} from '@/system/tracing/traceable.model';

export type Organization = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  locales: Set<string>;
} & CreateTraceable &
  UpdateTraceable &
  ArchiveTraceable;
