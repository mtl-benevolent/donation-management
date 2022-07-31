import { describe, expect, it } from 'vitest';
import { selectAlias } from './select-alias';

interface MyEntity {
  id: string;
  name: string;
  age: number;
}

describe('SQL Utils', () => {
  describe('select-alias', () => {
    it('should build alias object', () => {
      const result = selectAlias<MyEntity>('my_entities', [
        'id',
        'name',
        'age',
      ]);

      expect(result).toEqual({
        'my_entities:id': 'my_entities.id',
        'my_entities:name': 'my_entities.name',
        'my_entities:age': 'my_entities.age',
      });
    });

    it('when using a custom separator, should build alias object', () => {
      const result = selectAlias<MyEntity>(
        'my_entities',
        ['id', 'name', 'age'],
        ':::'
      );

      expect(result).toEqual({
        'my_entities:::id': 'my_entities.id',
        'my_entities:::name': 'my_entities.name',
        'my_entities:::age': 'my_entities.age',
      });
    });
  });
});
