import {
  Organization,
  OrganizationData,
} from '../../models/organization.model';

export type OrganizationDataDTO = {
  name: string;
  slug: string;
  logoUrl: string | null;
  locales: string[];

  isSetupComplete: boolean;
};

export type OrganizationDTO = OrganizationDataDTO & {
  id: string;
} & {
  createdAt: Date;
  updatedAt: Date | null;
};

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
    slug: dto.slug,
    logoUrl: dto.logoUrl,
    locales: new Set(dto.locales),
    smtpSettings: null,
  }),
};
