export function requireNotNull<T>(value: T | null | undefined, hint: string): T {
  if (value === null || value === undefined) {
    throw new Error(`requireNotNull check failed: '${hint}'.`)
  }
  return value
}
