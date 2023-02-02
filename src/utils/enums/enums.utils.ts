export function createEnums<T extends string>(...values: T[]): Record<T, T> {
  return values.reduce((acc, current) => {
    acc[current] = current;
    return acc;
  }, {} as any);
}

export function parseEnum<T extends string>(
  value: string | undefined | null,
  enumValues: Record<T, T>
): T {
  if (value == null) {
    throw new Error(
      `Unable to parse enum. Value "${value}" is not valid. Use one of the following values: (${Object.keys(
        enumValues
      ).join(', ')})`
    );
  }

  const parsedValue = enumValues[value];

  if (!parsedValue) {
    throw new Error(
      `Unable to parse enum. Value ${value} is not valid. Use one of the following values: (${Object.keys(
        enumValues
      ).join(', ')})`
    );
  }

  return parsedValue;
}

export function safelyParseEnum<T extends string>(
  value: string | null | undefined,
  enumValues: Record<T, T>,
  fallbackValue: T
): T {
  if (value == null) {
    return fallbackValue;
  }

  const parsedValue = enumValues[value];

  if (!parsedValue) {
    return fallbackValue;
  }

  return parsedValue;
}
