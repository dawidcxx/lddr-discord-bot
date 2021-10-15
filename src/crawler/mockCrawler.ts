import faker from 'faker'
import cloneDeep from 'clone-deep'
import { ClassType, LadderType } from '../sharedTypes'
import { range } from '../utils/range'
import { ICrawler, TeamOverview } from './crawler'
import { pickTwoRandomMiddleIdencies } from '../utils/pickTwoRandomMiddleIndencies'
import { swapArrayElement } from '../utils/swapArrayElement'

export class MockCrawler implements ICrawler {
  private mockTeams = {
    [LadderType.TWOS]: initMockTeams(),
    [LadderType.THREES]: initMockTeams(),
  }
  async getAllTeams(ladder: LadderType = LadderType.THREES): Promise<TeamOverview[]> {
    return cloneDeep(this.mockTeams[ladder])
  }
  shuffle(ladder: LadderType = LadderType.THREES): void {
    const [team1Index, team2Index] = pickTwoRandomMiddleIdencies(this.mockTeams[ladder])
    const rankTmp = this.mockTeams[ladder][team1Index].rank
    const ratingTmp = this.mockTeams[ladder][team1Index].rating
    this.mockTeams[ladder][team1Index].rank = this.mockTeams[ladder][team2Index].rank
    this.mockTeams[ladder][team2Index].rank = rankTmp
    this.mockTeams[ladder][team1Index].rating = this.mockTeams[ladder][team2Index].rating
    this.mockTeams[ladder][team2Index].rating = ratingTmp
    swapArrayElement(this.mockTeams[ladder], team1Index, team2Index)
  }
}

function initMockTeams(): TeamOverview[] {
  const fakeTeams: TeamOverview[] = []

  for (let i = 0; i < 50; i++) {
    fakeTeams.push({
      rank: i,
      name: faker.lorem.words(3),
      members: range(
        faker.datatype.number({
          min: 1,
          max: 5,
        })
      ).map((_) => ({
        class: faker.random.arrayElement([
          ClassType.DK,
          ClassType.Druid,
          ClassType.Hunter,
          ClassType.Mage,
          ClassType.Paladin,
          ClassType.Priest,
          ClassType.Rogue,
          ClassType.Shaman,
          ClassType.Warlock,
          ClassType.Warrior,
        ]),
        name: faker.name.lastName(),
      })),
      realmName: faker.random.arrayElement(['blackrock', 'icecrown', 'lordaeron']),
      win: faker.datatype.number(600),
      lose: faker.datatype.number(500),
      rating: 3000 - i * 12,
    })
  }
  return fakeTeams
}
