import cron from 'node-cron'
import { Analyzer } from '../analyzer/analyzer'
import { IConfig } from '../config'
import { MockCrawler } from '../crawler/mockCrawler'
import { DiscordSink } from '../sink/DiscordSink'
import { LoggerSink } from '../sink/LoggerSink'
import { Sink } from '../sink/Sink'
import { CrawlCronTask } from './CrawlCronTask'

export async function registerCronJob(config: IConfig) {
  const crawler = new MockCrawler()
  const analyzer = new Analyzer()
  const sinks: Sink[] = [new LoggerSink(), new DiscordSink(config.discordToken)]
  await Promise.all(sinks.map((sink) => sink.setup?.()))

  const task = new CrawlCronTask(crawler, analyzer, sinks)

  const job = cron.schedule('* * * * *', () => {
    task.execute()
    crawler.shuffle()
    crawler.shuffle()
  })

  return () => job.stop()
}
