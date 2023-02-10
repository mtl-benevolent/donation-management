import { DonationEntryDBEntity } from '../../donations/repositories/db-entities/donation-entry.db-entity';
import { DonationDBEntity } from '../../donations/repositories/db-entities/donation.db-entity';
import {
  GetQueryBuilder,
  makeGetQueryBuilder,
} from '../../libs/knex/query-builder';
import { OrganizationDBEntity } from '../../organizations/repositories/db-entities/organization.db-entity';
import { SQLUtils } from '../../utils/sql/sql.utils';

export const DB = {
  organizations: buildDBEntityConfig<OrganizationDBEntity>('organizations'),
  donations: buildDBEntityConfig<DonationDBEntity>('donations'),
  donationEntries:
    buildDBEntityConfig<DonationEntryDBEntity>('donation_entries'),
} as const;

interface DBEntityConfig<T extends {}> {
  readonly tableName: string;
  readonly getField: (field: keyof T, separator?: string) => string;
  readonly selectAlias: (
    fields: (keyof T)[],
    separator?: string
  ) => Record<string, string>;
  readonly getQueryBuilder: GetQueryBuilder<T>;
  readonly extractEntity: (row: any, separator?: string) => T;
  readonly extractEntities: (rows: any[], separator?: string) => T[];
}

function buildDBEntityConfig<T extends {}>(
  tableName: string
): DBEntityConfig<T> {
  return {
    tableName,
    getField: (field, separator) =>
      SQLUtils.getFieldName<T>(tableName, field, separator),
    selectAlias: (fields, separator) =>
      SQLUtils.selectAlias<T>(tableName, fields, separator),
    getQueryBuilder: makeGetQueryBuilder<T>(tableName),
    extractEntity: (row, separator) =>
      SQLUtils.extractEntity<T>(row, tableName, separator),
    extractEntities: (rows, separator) =>
      SQLUtils.extractEntities<T>(rows, tableName, separator),
  };
}
