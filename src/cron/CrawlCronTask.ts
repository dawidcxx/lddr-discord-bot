import { Analyzer } from '../analyzer/analyzer'
import { ICrawler } from '../crawler/crawler'
import { LadderType } from '../sharedTypes'
import { Sink } from '../sink/Sink'

export class CrawlCronTask {
  private isRunning: boolean = false
  constructor(
    private readonly crawler: ICrawler,
    private readonly anaylzer: Analyzer,
    private readonly sinks: Sink[]
  ) {}

  async execute(): Promise<void> {
    if (!this.isRunning) {
      const startedAt = new Date().getTime()
      this.isRunning = true
      console.log('Starting the crawling process..')
      await this.execInternal()
      this.isRunning = false
      console.log(`Finished the crawling process, elapsed: ${new Date().getTime() - startedAt}ms`)
    } else {
      console.warn('Previous task is still runnig.')
    }
  }

  private async execInternal(): Promise<void> {
    const teams = await this.crawler.getAllTeams(LadderType.THREES)
    const analysisReport = this.anaylzer.analyzeLadder(teams)
    await Promise.all(this.sinks.map((sink) => sink.onLadderUpdates(analysisReport)))
  }
}
