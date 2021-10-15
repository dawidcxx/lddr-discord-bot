import { ClassType, LadderType } from '../sharedTypes'

export interface ICrawler {
  getAllTeams(ladder: LadderType): Promise<Array<TeamOverview>>
}

export interface TeamOverview {
  rank: number
  name: string
  members: {
    class: ClassType
    name: string
  }[]
  realmName: string
  win: number
  lose: number
  rating: number
}
