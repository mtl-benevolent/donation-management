import { createEnums } from '@/utils/enums/enums.utils';

export type Environment = 'sandbox' | 'live';

export const Environments = createEnums<Environment>('sandbox', 'live');
