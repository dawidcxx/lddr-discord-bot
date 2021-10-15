export function arrayDiff<T>(arr1: Array<T>, arr2: Array<T>): Array<T> {
  return arr1.filter((x) => !arr2.includes(x)).concat(arr2.filter((x) => !arr1.includes(x)))
}
