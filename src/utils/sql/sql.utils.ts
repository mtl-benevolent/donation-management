import { extractEntities, extractEntity } from './extract-entity';
import { getFieldName, selectAlias } from './select-alias';

export const SQLUtils = {
  selectAlias,
  getFieldName,
  extractEntity,
  extractEntities,
};
