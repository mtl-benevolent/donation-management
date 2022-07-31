import { appConfig } from '../../config';
import { makeDecrypt } from './decrypt';
import { makeEncrypt } from './encrypt';

export const encryption = {
  encrypt: makeEncrypt(appConfig.encryption.secretValue),
  decrypt: makeDecrypt(appConfig.encryption.secretValue),
};
