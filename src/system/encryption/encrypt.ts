import crypto from 'node:crypto';
import { regex } from '../../utils/text/regex.utils';

export type EncryptFn = ReturnType<typeof makeEncrypt>;

export function makeEncrypt(secretKey: string) {
  if (!regex.hexadecimal.test(secretKey)) {
    throw new Error('secretKey is not in the Hexadecimal format');
  }

  const key = Buffer.from(secretKey, 'hex');

  if (key.byteLength !== 32) {
    throw new Error('Invalid secret key length. Must be exactly 32 bytes');
  }

  return function encrypt(toEncrypt: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes256', key, iv);

    const toEncryptBinary = Buffer.from(toEncrypt, 'utf-8');

    const encrypted = Buffer.concat([
      cipher.update(toEncryptBinary),
      cipher.final(),
    ]);

    return `${iv.toString('hex')}::${encrypted.toString('hex')}`;
  };
}
