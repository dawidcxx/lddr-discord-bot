import { range } from './range'
import { pickTwoRandomMiddleIdencies } from './pickTwoRandomMiddleIndencies'

describe('twoRandomMiddleIdencies test suite', () => {
  it('Should return a few random middle-ish indecies successfully', () => {
    const array = range(100)

    function checkPair(pair: [number, number]) {
      expect(pair[0]).toBeGreaterThanOrEqual(0)
      expect(pair[0]).toBeLessThan(array.length)
      expect(pair[1]).toBeGreaterThanOrEqual(0)
      expect(pair[1]).toBeLessThan(array.length)
      expect(pair[0]).not.toEqual(pair[1])
    }

    range(1000).forEach(() => {
      const pair = pickTwoRandomMiddleIdencies(array)
      checkPair(pair)
    })
  })
})
