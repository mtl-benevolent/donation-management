import Joi from 'joi';
import {
  CreateTraceableDTO,
  UpdateTraceableDTO,
} from '../../../system/tracing/traceable.dto';
import { standardSchema } from '../../../system/validation/standard-validation';
import { Organization } from '../../models/organization.model';

export type OrganizationDTO = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  locales: string[];
} & CreateTraceableDTO &
  UpdateTraceableDTO;

export const organizationDTOSchema = Joi.object<OrganizationDTO>({
  id: standardSchema.objectId.required(),
  name: Joi.string().required(),
  slug: standardSchema.webSlug.required(),
  logoUrl: Joi.string().uri().allow(null).required(),
  locales: Joi.array().items(standardSchema.locale).min(1).required(),

  createdAt: standardSchema.createdAt.required(),
  updatedAt: standardSchema.updatedAt.required(),
});

export const organizationDTOMappers = {
  toDTO: (model: Organization): OrganizationDTO => ({
    id: model.id,
    name: model.name,
    slug: model.slug,
    logoUrl: model.logoUrl,
    locales: Array.from(model.locales),

    createdAt: model.createdAt,
    updatedAt: model.updatedAt,
  }),
};
