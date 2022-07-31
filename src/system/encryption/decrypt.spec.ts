import { describe, it, expect } from 'vitest';
import { makeDecrypt } from './decrypt';

const SECRET_KEY = `1935217e463874c427f4b3f7cacb242540ff07312b070c6cf3c2f3de8c70575c`;

const ENCRYPTED =
  '80a76bfa92796bdb89fb0742fcef0dd2::262d5b9c9b32b09c8a13fbfd5223ba30821bf46dc9bc0fd8c41fb8daf02f023cbd4619903fa1967780dae442afe45552cd7041203f2091fc134c5176415354a1';
const EXPECTED_VALUE = 'this is my initial value. Please encrypt it well';

describe('Encryption', () => {
  describe('makeDecrypt', () => {
    it('when secretKey is not 32 bytes long, should throw Error', () => {
      expect(() => makeDecrypt('abc')).toThrowError();
    });

    it('when secretKey is not hexadecimal, should throw Error', () => {
      expect(() => makeDecrypt('zzzzzzzz')).toThrowError();
    });
  });

  describe('decrypt', () => {
    it('should decrypt value', () => {
      const decrypt = makeDecrypt(SECRET_KEY);

      const result = decrypt(ENCRYPTED);
      expect(result).toBe(EXPECTED_VALUE);
    });
  });
});
