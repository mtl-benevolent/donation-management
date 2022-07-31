export function extractEntity<T extends Record<string, any>>(
  row: any,
  table: string,
  separator = ':'
): T {
  const prefix = `${table}${separator}`;

  return Object.entries(row).reduce<any>((acc, [key, value]) => {
    if (key.startsWith(prefix)) {
      const fieldKey = key.replace(prefix, '');
      acc[fieldKey] = value;
    }

    return acc;
  }, {} as any);
}
