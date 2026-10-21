// Use this when adding feature permissions. The API must check them too.
export function hasPermission(
  enabled: boolean,
  granted: readonly string[],
  required: string,
) {
  return !enabled || granted.includes(required);
}
