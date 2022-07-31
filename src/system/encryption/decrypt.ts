import crypto from 'node:crypto';
import { regex } from '../../utils/text/regex.utils';

export type DecryptFn = ReturnType<typeof makeDecrypt>;

export function makeDecrypt(secretKey: string) {
  if (!regex.hexadecimal.test(secretKey)) {
    throw new Error('secretKey is not in the Hexadecimal format');
  }

  const key = Buffer.from(secretKey, 'hex');

  if (key.byteLength !== 32) {
    throw new Error('Invalid secret key length. Must be exactly 32 bytes');
  }

  return function decrypt(toDecrypt: string): string {
    const [iv, encrypted] = toDecrypt
      .split('::', 2)
      .map((hex) => Buffer.from(hex, 'hex'));

    const decipher = crypto.createDecipheriv('aes256', key, iv);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return decrypted.toString('utf-8');
  };
}
