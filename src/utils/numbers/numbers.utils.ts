export function safelyParseInteger(
  value: string | undefined | null,
  fallbackValue = 0
): number {
  if (value == null) {
    return fallbackValue;
  }

  const maybeInt = parseInt(value, 10);

  if (Number.isNaN(maybeInt)) {
    return fallbackValue;
  }

  return maybeInt;
}
