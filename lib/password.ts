export function normalizeSecret(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function secretsMatch(input: string, expected: string) {
  return normalizeSecret(input) === normalizeSecret(expected);
}
