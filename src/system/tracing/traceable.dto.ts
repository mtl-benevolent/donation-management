export interface CreateTraceableDTO {
  createdAt: Date;
}

export interface UpdateTraceableDTO {
  updatedAt: Date | null;
}

export interface ArchiveTraceableDTO {
  archivedAt: Date | null;
}
