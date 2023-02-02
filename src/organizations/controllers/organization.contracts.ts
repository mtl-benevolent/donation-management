import Joi from 'joi';
import { standardSchema } from '../../system/validation/standard-validation';
import { organizationDTOSchema } from './dtos/organization.dto';

export type CreateOrganizationRequest = {
  name: string;
  slug: string;
  logoUrl: string | null;
  locales: string[];
};

export type UpdateOrganizationRequest = Partial<CreateOrganizationRequest>;

export const organizationContracts = {
  params: {
    slug: standardSchema.webSlug.required(),
  },
  requests: {
    create: Joi.object<CreateOrganizationRequest>({
      name: Joi.string().required(),
      slug: standardSchema.webSlug.max(128).required(),
      logoUrl: Joi.string().uri().allow(null).required(),
      locales: Joi.array().items(standardSchema.locale).min(1).required(),
    }),
    update: Joi.object<UpdateOrganizationRequest>({
      name: Joi.string().optional(),
      slug: standardSchema.webSlug.max(128).optional(),
      logoUrl: Joi.string().uri().allow(null).optional(),
      locales: Joi.array().items(standardSchema.locale).min(1).optional(),
    }),
  },
  responses: {
    organizationDTO: organizationDTOSchema,
  },
};
