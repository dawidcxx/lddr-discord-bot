import { TeamOverview } from '../crawler/crawler'
import cloneDeep from 'clone-deep'
import { arrayDiff } from '../utils/arrayDiff'

export interface IAnalysisReport {
  results: IAnalysis[]
}

export type IAnalysisEvent = 'rating-change' | 'gain' | 'lose' | 'appeared' | 'removed' | 'roaster-change'

export interface IAnalysisRatingChange {
  event: 'rating-change'
  ratingDiff: number
  teamNow: TeamOverview
  teamBefore: TeamOverview
}

export interface IAnalysisTeamAppeared {
  event: 'appeared'
  teamNow: TeamOverview
}

export interface IAnalysisTeamRemoved {
  event: 'removed'
  teamBefore: TeamOverview
}

export interface IAnalysisRoasterChange {
  event: 'roaster-change'
  teamNow: TeamOverview
  teamBefore: TeamOverview
}

export type IAnalysis = IAnalysisRatingChange | IAnalysisTeamAppeared | IAnalysisTeamRemoved | IAnalysisRoasterChange

export class Analyzer {
  private previousTeams: TeamLookup | null = null

  analyzeLadder(teams: TeamOverview[]): IAnalysisReport {
    if (this.previousTeams === null) {
      this.previousTeams = makeLookup(teams)
      return { results: [] }
    } else {
      const teamsNowLookup = makeLookup(teams)
      const builder: IAnalysisReport['results'] = []

      for (const team of teams) {
        const teamId = makeKey(team)
        if (this.previousTeams.has(teamId)) {
          const teamBefore = this.previousTeams.get(teamId)

          if (teamBefore.rating !== team.rating) {
            builder.push({
              event: 'rating-change',
              ratingDiff: team.rating - teamBefore.rating,
              teamNow: team,
              teamBefore,
            })
          }

          const roasterBefore = teamBefore.members.map((it) => it.name)
          const roasterNow = team.members.map((it) => it.name)
          if (arrayDiff(roasterBefore, roasterNow).length > 0) {
            builder.push({
              event: 'roaster-change',
              teamNow: team,
              teamBefore: teamBefore,
            })
          }
        } else {
          builder.push({
            event: 'appeared',
            teamNow: cloneDeep(team),
          })
        }
      }

      for (const [teamId, team] of this.previousTeams.entries()) {
        if (!teamsNowLookup.has(teamId)) {
          builder.push({
            event: 'removed',
            teamBefore: team,
          })
        }
      }

      this.previousTeams = teamsNowLookup
      return { results: builder }
    }
  }
}

type TeamAndRealm = string & {
  __tag: 'TeamAndRealm'
}
type TeamLookup = Map<TeamAndRealm, TeamOverview>

function makeKey(team: TeamOverview): TeamAndRealm {
  return `${team.name}-${team.realmName}` as TeamAndRealm
}

function makeLookup(teams: TeamOverview[]): TeamLookup {
  return new Map(teams.map((team) => [makeKey(team), team]))
}
