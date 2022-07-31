import Joi from 'joi';
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

export const smtpSettingsDTOSchema = Joi.object<SmtpSettingsDTO>({
  host: Joi.string().hostname().required(),
  port: Joi.number().port().required(),
  secure: Joi.bool().required(),
  username: Joi.string().min(1).required(),
  password: Joi.string().min(1).required(),
  from: Joi.string().email().allow(null).required(),
  replyTo: Joi.string().email().allow(null).required(),
});

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
