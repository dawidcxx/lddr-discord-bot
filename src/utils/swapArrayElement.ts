export function swapArrayElement<T>(arr: Array<T>, from: number, to: number): void {
  let temp = arr[to]
  arr[to] = arr[from]
  arr[from] = temp
}
