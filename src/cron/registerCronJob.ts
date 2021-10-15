import cron from 'node-cron'
import { Analyzer } from '../analyzer/analyzer'
import { MockCrawler } from '../crawler/mockCrawler'
import { LoggerSink } from '../sink/LoggerSink'
import { CrawlCronTask } from './CrawlCronTask'

export function registerCronJob() {
  const crawler = new MockCrawler()
  const analyzer = new Analyzer()
  const sinks = [new LoggerSink()]
  const task = new CrawlCronTask(crawler, analyzer, sinks)

  const job = cron.schedule('* * * * *', () => {
    task.execute()
  })

  return () => job.stop()
}
