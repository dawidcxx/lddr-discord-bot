import { IAnalysisReport } from '../analyzer/analyzer'
import { Sink } from './Sink'

export class LoggerSink implements Sink {
  async onLadderUpdates(report: IAnalysisReport): Promise<void> {
    if (report.results.length === 0) {
      console.log('No ladder updates detected')
    }

    for (const analysis of report.results) {
      switch (analysis.event) {
        case 'appeared':
          console.log(`A new team has appeared of name: '${analysis.teamNow.name}'`, analysis.teamNow)
          break
        case 'rating-change':
          console.log(`The team: '${analysis.teamNow.name}' has changed its rating: ${analysis.ratingDiff}`)
          break
        case 'removed':
          console.log(`The team: '${analysis.teamBefore.name}' has disappeared from the ladder`, analysis.teamBefore)
          break
        case 'roaster-change':
          console.log(
            `The team: '${analysis.teamNow.name}'' has updated its roaster`,
            analysis.teamBefore.members.map((it) => [it.class, it.name]),
            analysis.teamNow.members.map((it) => [it.class, it.name])
          )
          break
      }
    }
  }
}
