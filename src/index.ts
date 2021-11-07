require('dotenv').config()
import { getConfiguration } from './config'
import { registerCronJob } from './cron/registerCronJob'
import { sleep } from './utils/sleep'

let shouldClose: boolean = false

async function main(): Promise<void> {
  const config = getConfiguration()
  const cleanup = await registerCronJob(config)
  console.log('Cron job registered')
  for (;;) {
    if (shouldClose) {
      await cleanup()
      break
    } else {
      await sleep(200)
      continue
    }
  }
}

main().catch((error) => {
  console.error('Uncaugh exception', error)
  process.exit(727)
})

process.on('SIGINT', () => {
  shouldClose = true
})
