import { ClassType, ClassTypes, IClosable, LadderType } from '../sharedTypes'

export interface ICrawler extends IClosable {
  getAllTeams(ladder: LadderType): Promise<Array<TeamOverview>>
}

export interface TeamOverview {
  rank: number
  name: string
  members: {
    class: ClassTypes
    name: string
  }[]
  realmName: string
  win: number
  lose: number
  rating: number
}
