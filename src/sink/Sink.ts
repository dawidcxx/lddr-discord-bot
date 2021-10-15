import { IAnalysisReport } from '../analyzer/analyzer'

export interface Sink {
  onLadderUpdates(report: IAnalysisReport): Promise<void>
}
