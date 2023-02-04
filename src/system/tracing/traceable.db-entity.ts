import { Clock } from '../clock/clock';
import { GetContextValueFn } from '../context/create-context';
import { UserInfo } from '../context/user-info';
import {
  ArchiveTraceable,
  CreateTraceable,
  UpdateTraceable,
} from './traceable.model';

export const traceDBFields = {
  create: ['created_at', 'created_by'] as (keyof CreateTraceableDBEntity)[],
  update: ['updated_at', 'updated_by'] as (keyof UpdateTraceableDBEntity)[],
  archive: ['archived_at', 'archived_by'] as (keyof ArchiveTraceableDBEntity)[],
};

export interface CreateTraceableDBEntity {
  created_at: Date;
  created_by: string;
}

export interface UpdateTraceableDBEntity {
  updated_at: Date | null;
  updated_by: string | null;
}

export interface ArchiveTraceableDBEntity {
  archived_at: Date | null;
  archived_by: string | null;
}

export const traceableDBMappers = {
  toCreateModel: (dbEntity: CreateTraceableDBEntity): CreateTraceable => ({
    createdAt: dbEntity.created_at,
    createdBy: dbEntity.created_by,
  }),
  toUpdateModel: (dbEntity: UpdateTraceableDBEntity): UpdateTraceable => ({
    updatedAt: dbEntity.updated_at,
    updatedBy: dbEntity.updated_by,
  }),
  toArchiveModel: (dbEntity: ArchiveTraceableDBEntity): ArchiveTraceable => ({
    archivedAt: dbEntity.archived_at,
    archivedBy: dbEntity.archived_by,
  }),
};

export const traceableInjectors = {
  injectCreateFields: (
    clock: Clock,
    getUserInfo: GetContextValueFn<UserInfo>
  ): CreateTraceableDBEntity => ({
    created_at: clock.now(),
    created_by: getUserInfo()?.id ?? 'UNKNOWN',
  }),
  injectUpdateFields: (
    clock: Clock,
    getUserInfo: GetContextValueFn<UserInfo>
  ): UpdateTraceableDBEntity => ({
    updated_at: clock.now(),
    updated_by: getUserInfo()?.id ?? 'UNKNOWN',
  }),
  injectArchiveFields: (
    clock: Clock,
    getUserInfo: GetContextValueFn<UserInfo>
  ): ArchiveTraceableDBEntity => ({
    archived_at: clock.now(),
    archived_by: getUserInfo()?.id ?? 'UNKNOWN',
  }),
};
