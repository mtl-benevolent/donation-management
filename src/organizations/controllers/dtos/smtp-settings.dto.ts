import { SmtpSettings } from '../../models/organization.model';

export type SmtpSettingsDTO = {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  from: string | null;
  replyTo: string | null;
};

export const smtpSettingsDTOMappers = {
  toDTO: (model: SmtpSettings): SmtpSettingsDTO => ({
    host: model.host,
    port: model.port,
    secure: model.secure,
    username: model.username,
    password: model.password,
    from: model.from,
    replyTo: model.replyTo,
  }),
  toSmtpSettingsModelData: (dto: SmtpSettingsDTO): SmtpSettings => ({
    host: dto.host,
    port: dto.port,
    secure: dto.secure,
    username: dto.username,
    password: dto.password,
    from: dto.from,
    replyTo: dto.replyTo,
  }),
};
