import { describe, it, expect } from 'vitest';
import { extractEntity } from './extract-entity';

interface MyEntity {
  id: string;
  name: string;
  age: number;
}

describe('SQL Utils', () => {
  describe('extract-entity', () => {
    it('should only extract the relevant fields', () => {
      const row = {
        'my_entities:id': '1',
        'my_entities:name': 'John Doe',
        'my_entities:age': 27,
        'my_stuff:id': '99',
        'my_stuff:name': 'Umbrella',
      };

      const result = extractEntity<MyEntity>(row, 'my_entities');

      expect(result).toEqual({
        id: '1',
        name: 'John Doe',
        age: 27,
      });
    });

    it('when using a custom separator, should build alias object', () => {
      const createdAt = new Date();

      const row = {
        'my_entities~id': '1',
        'my_entities~name': 'John Doe',
        'my_entities~age': 27,
        'my_entities:created_at': createdAt,
        'my_stuff~id': '99',
        'my_stuff~name': 'Umbrella',
      };

      const result = extractEntity<MyEntity>(row, 'my_entities', '~');

      expect(result).toEqual({
        id: '1',
        name: 'John Doe',
        age: 27,
      });
    });
  });
});
