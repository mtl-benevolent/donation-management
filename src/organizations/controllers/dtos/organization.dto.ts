import Joi from 'joi';
import { standardSchema } from '../../../system/validation/standard-validation';
import {
  Organization,
  OrganizationData,
} from '../../models/organization.model';

export type OrganizationDataDTO = {
  name: string;
  slug: string;
  logoUrl: string | null;
  locales: string[];
};

export const organizationDataDTOSchema = Joi.object<OrganizationDataDTO>({
  name: Joi.string().min(1).required(),
  slug: standardSchema.webSlug.required(),
  logoUrl: Joi.string().min(1).uri().allow(null).required(),
  locales: Joi.array()
    .min(1)
    .items(standardSchema.locale.required())
    .required(),
});

export type OrganizationDTO = OrganizationDataDTO & {
  id: string;
  isSetupComplete: boolean;
} & {
  createdAt: Date;
  updatedAt: Date | null;
};

export const organizationDTOSchema = organizationDataDTOSchema.concat(
  Joi.object<OrganizationDTO>({
    id: Joi.string().uuid().required(),
    isSetupComplete: Joi.bool().required(),

    createdAt: Joi.date().required(),
    updatedAt: Joi.date().allow(null).required(),
  })
) as Joi.ObjectSchema<OrganizationDTO>;

export const organizationDTOMappers = {
  toDTO: (model: Organization): OrganizationDTO => ({
    id: model.id,
    name: model.name,
    slug: model.slug,
    logoUrl: model.logoUrl,
    locales: Array.from(model.locales),

    isSetupComplete: !!model.smtpSettings,

    createdAt: model.createdAt,
    updatedAt: model.updatedAt,
  }),
  toOrgDataModel: (dto: OrganizationDataDTO): OrganizationData => ({
    name: dto.name,
    slug: dto.slug.toLowerCase(),
    logoUrl: dto.logoUrl,
    locales: new Set(dto.locales),
    smtpSettings: null,
  }),
};
