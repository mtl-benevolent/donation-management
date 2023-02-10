export function selectAlias<T>(
  table: string,
  fields: (keyof T)[],
  separator = ':'
): Record<string, string> {
  return fields.reduce<Record<string, string>>((acc, field) => {
    acc[getFieldName(table, field, separator)] = getFieldName(table, field);

    return acc;
  }, {});
}

export function getFieldName<T = any>(
  table: string,
  field: keyof T,
  separator = '.'
): string {
  return `${table}${separator}${String(field)}`;
}
