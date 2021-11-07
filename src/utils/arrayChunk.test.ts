import { arrayChunk } from './arrayChunk'

describe('arrayChunk spec', () => {
  it('should return an empty array given an empty array', () => {
    expect(arrayChunk([], 12)).toStrictEqual([])
  })

  it('should chunk over items as expected', () => {
    expect(arrayChunk([1, 2, 3, 4], 2)).toStrictEqual([
      [1, 2],
      [3, 4],
    ])
  })
})
