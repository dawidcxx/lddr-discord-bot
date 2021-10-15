import { MockCrawler } from '../crawler/mockCrawler'
import { LadderType } from '../sharedTypes'
import { range } from '../utils/range'
import { Analyzer } from './analyzer'

describe('analyzer test suite', () => {
  it('should pickup some random events', async () => {
    const crawler = new MockCrawler()
    const analyzer = new Analyzer()

    const { results: resultsPre } = analyzer.analyzeLadder(await crawler.getAllTeams(LadderType.THREES))

    expect(resultsPre).toHaveLength(0)

    range(50).forEach((_) => {
      crawler.shuffle()
    })

    const { results } = analyzer.analyzeLadder(await crawler.getAllTeams(LadderType.THREES))

    expect(results).not.toHaveLength(0)
  })
})
