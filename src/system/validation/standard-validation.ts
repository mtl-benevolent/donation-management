import { regex } from '@/utils/text/regex.utils';
import Joi from 'joi';

export const standardSchema = {
  objectId: Joi.string().uuid(),
  webSlug: Joi.string().min(1).regex(regex.slug),
  locale: Joi.string().regex(regex.locale),
  createdAt: Joi.date(),
  updatedAt: Joi.date().allow(null),
  archivedAt: Joi.date().allow(null),
};
