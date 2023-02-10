import { createEnums } from '../../utils/enums/enums.utils';

export type AppEnvironment =
  | 'development'
  | 'compose'
  | 'staging'
  | 'production';

export const appEnvironments = createEnums<AppEnvironment>(
  'development',
  'compose',
  'staging',
  'production'
);
