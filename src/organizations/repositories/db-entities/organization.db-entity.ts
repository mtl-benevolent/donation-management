import {
  ArchiveTraceableDBEntity,
  CreateTraceableDBEntity,
  traceableDBMappers,
  UpdateTraceableDBEntity,
} from '../../../system/tracing/traceable.db-entity';
import {
  Organization,
  OrganizationData,
  SmtpSettings,
} from '../../models/organization.model';

export type OrganizationDataDBEntity = {
  name: string;
  slug: string;
  logo_url: string | null;
  locales: {
    locales: string[];
  };
  smtp_settings: SmtpSettings | null;
};

export type OrganizationDBEntity = OrganizationDataDBEntity & {
  id: string;
} & CreateTraceableDBEntity &
  UpdateTraceableDBEntity &
  ArchiveTraceableDBEntity;

export const organizationDBMappers = {
  toModel: (
    dbEntity: OrganizationDBEntity,
    decryptSmtpPassword?: (smtpPassword: string) => string
  ): Organization => ({
    id: dbEntity.id,
    name: dbEntity.name,
    slug: dbEntity.slug,
    logoUrl: dbEntity.logo_url,
    locales: new Set(dbEntity.locales.locales),
    smtpSettings: dbEntity.smtp_settings
      ? {
          host: dbEntity.smtp_settings.host,
          port: dbEntity.smtp_settings.port,
          secure: dbEntity.smtp_settings.secure,
          username: dbEntity.smtp_settings.username,
          password: decryptSmtpPassword
            ? dbEntity.smtp_settings.password
              ? decryptSmtpPassword(dbEntity.smtp_settings.password)
              : ''
            : '******',
          from: dbEntity.smtp_settings.from,
          replyTo: dbEntity.smtp_settings.replyTo,
        }
      : null,

    ...traceableDBMappers.toCreateModel(dbEntity),
    ...traceableDBMappers.toUpdateModel(dbEntity),
    ...traceableDBMappers.toArchiveModel(dbEntity),
  }),
  toInsert: (
    model: OrganizationData,
    encryptSmtpPassword: (smtpPassword: string) => string
  ): OrganizationDataDBEntity => ({
    name: model.name,
    slug: model.slug,
    logo_url: model.logoUrl,
    locales: {
      locales: Array.from(model.locales),
    },
    smtp_settings: model.smtpSettings
      ? {
          host: model.smtpSettings.host,
          port: model.smtpSettings.port,
          secure: model.smtpSettings.secure,
          username: model.smtpSettings.username,
          password: encryptSmtpPassword(model.smtpSettings.password),
          from: model.smtpSettings.from,
          replyTo: model.smtpSettings.replyTo,
        }
      : null,
  }),
};
