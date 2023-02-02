import Joi from 'joi';
import {
  ValidationError,
  ValidationErrorDetail,
} from '../errors/validation.error';

export function assertValid(model: any, schema: Joi.Schema) {
  const result = schema.validate(model, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (!result.error) {
    return;
  }

  const details = result.error.details.map<ValidationErrorDetail>((detail) => {
    const path = detail.path.map(String).join('.');

    return {
      [path]: detail.message,
    };
  });

  throw new ValidationError('ValidationError', details);
}
