import { clampArrayIndex } from './clampArrayIndex'
import { randomInt } from './randomInt'

/**
 * Get two random middle-ish indencies of the aray
 * @param arr Source to get the indecies from
 * @returns two random middle-ish indecies from the array
 */
export function pickTwoRandomMiddleIdencies(arr: Array<any>): [number, number] {
  const arrayHalf = Math.floor(arr.length / 2)
  let first = 0
  let last = arr.length

  first = clampArrayIndex(arr, first + randomInt(0, arrayHalf))
  last = clampArrayIndex(arr, randomInt(0, arrayHalf))

  if (first === last && arr.length > 2) {
    // retry
    return pickTwoRandomMiddleIdencies(arr)
  } else {
    return [first, last]
  }
}
