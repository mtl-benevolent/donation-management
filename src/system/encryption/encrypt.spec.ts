import { describe, it, expect } from 'vitest';
import { makeEncrypt } from './encrypt';

const SECRET_KEY = `1935217e463874c427f4b3f7cacb242540ff07312b070c6cf3c2f3de8c70575c`;

const EXPECTED_FORMAT_REGEX = /^([0-9a-f]+)::([0-9a-f]+)$/;

describe('Encryption', () => {
  describe('makeEncrypt', () => {
    it('when secretKey is not 32 bytes long, should throw Error', () => {
      expect(() => makeEncrypt('abc')).toThrowError();
    });

    it('when secretKey is not hexadecimal, should throw Error', () => {
      expect(() => makeEncrypt('zzzzzzzz')).toThrowError();
    });
  });

  describe('encrypt', () => {
    it('should encrypt value', () => {
      const encrypt = makeEncrypt(SECRET_KEY);
      const initialValue = 'this is my initial value. Please encrypt it well';

      const result = encrypt(initialValue);
      expect(result).toMatch(EXPECTED_FORMAT_REGEX);
      expect(result).not.toContain(initialValue);
    });
  });
});
