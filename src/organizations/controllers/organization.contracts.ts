import { standardSchema } from '../../system/validation/standard-validation';
import {
  organizationDataDTOSchema,
  organizationDTOSchema,
} from './dtos/organization.dto';
import { smtpSettingsDTOSchema } from './dtos/smtp-settings.dto';

export const organizationContracts = {
  params: {
    slug: standardSchema.webSlug.required(),
  },
  requests: {
    organizationData: organizationDataDTOSchema,
  },
  responses: {
    organizationDTO: organizationDTOSchema,
    smtpSettings: smtpSettingsDTOSchema,
  },
};
