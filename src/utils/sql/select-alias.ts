export function selectAlias<T>(
  table: string,
  fields: (keyof T)[],
  separator = ':'
): Record<string, string> {
  return fields.reduce<Record<string, string>>((acc, field) => {
    acc[`${table}${separator}${field}`] = `${table}.${field}`;

    return acc;
  }, {});
}
