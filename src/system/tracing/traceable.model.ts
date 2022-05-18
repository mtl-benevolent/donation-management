export interface CreateTraceable {
  createdAt: Date;
  createdBy: string;
}

export interface UpdateTraceable {
  updatedAt: Date | null;
  updatedBy: string | null;
}

export interface ArchiveTraceable {
  archivedAt: Date | null;
  archivedBy: string | null;
}
