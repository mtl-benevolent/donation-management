import Joi from 'joi';
import { regex } from '../../utils/text/regex.utils';

export const standardSchema = {
  webSlug: Joi.string().min(1).regex(regex.slug),
  locale: Joi.string().regex(regex.locale),
};
