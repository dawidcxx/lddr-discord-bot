import { clampArrayIndex } from './clampArrayIndex'
import { range } from './range'

describe('clampArrayIndex test suite', () => {
  it('should return the array length-1 on a exceeding index given', () => {
    const arr = range(100)
    expect(clampArrayIndex(arr, 5000)).toEqual(99)
  })

  it('should return 0 on a empty array', () => {
    const arr = range(0)
    expect(clampArrayIndex(arr, 5000)).toEqual(0)
  })

  it('should return 0 given a negative number', () => {
    const arr = range(100)
    expect(clampArrayIndex(arr, -51)).toEqual(0)
  })

  it('should return the identify given a number within bounds', () => {
    const arr = range(100)
    expect(clampArrayIndex(arr, 5)).toEqual(5)
  })
})
