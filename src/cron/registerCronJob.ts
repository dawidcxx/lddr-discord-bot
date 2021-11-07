import cron from 'node-cron'
import { Analyzer } from '../analyzer/analyzer'
import { IConfig } from '../config'
import { ICrawler } from '../crawler/crawler'
import { MockCrawler } from '../crawler/mockCrawler'
import { DiscordSink } from '../sink/DiscordSink'
import { LoggerSink } from '../sink/LoggerSink'
import { Sink } from '../sink/Sink'
import { CrawlCronTask } from './CrawlCronTask'

export async function registerCronJob(config: IConfig) {
  const crawler: ICrawler = new MockCrawler()
  const analyzer = new Analyzer()
  const sinks: Sink[] = [new LoggerSink(), new DiscordSink(config.discordToken)]
  await Promise.all(sinks.map((sink) => sink.setup?.()))
  if (crawler.setup) {
    await crawler.setup()
  }

  const task = new CrawlCronTask(crawler, analyzer, sinks)

  const job = cron.schedule('* * * * *', () => {
    task.execute()
    ;(crawler as MockCrawler).shuffle()
    ;(crawler as MockCrawler).shuffle()
  })

  return async () => {
    job.stop()
    if (crawler.close) {
      await crawler.close()
    }
  }
}
