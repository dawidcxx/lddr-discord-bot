import { LadderType } from '../sharedTypes'
import { MockCrawler } from './mockCrawler'

describe('MockCrawler test suite', () => {
  const crawler = new MockCrawler()

  it('Should return some teams', async () => {
    const teams = await crawler.getAllTeams(LadderType.THREES)
    expect(teams).toBeInstanceOf(Array)
    expect(teams.length).toBeGreaterThan(0)
  })

  it(`Should return the same teams on repeated 'getAllTeams' calls`, async () => {
    const teams1 = await crawler.getAllTeams(LadderType.THREES)
    const teams2 = await crawler.getAllTeams(LadderType.THREES)
    expect(teams1).toEqual(teams2)
  })

  it('Should be different after a shuffle', async () => {
    const teamSnapshot1 = await crawler.getAllTeams(LadderType.THREES)
    crawler.shuffle(LadderType.THREES)
    const teamSnapshot2 = await crawler.getAllTeams(LadderType.THREES)
    expect(teamSnapshot1).not.toEqual(teamSnapshot2)
  })
})
