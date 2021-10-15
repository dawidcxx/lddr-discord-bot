export function clampArrayIndex(array: Array<any>, index: number) {
  return Math.min(Math.max(index, 0), array.length === 0 ? 0 : array.length - 1)
}
