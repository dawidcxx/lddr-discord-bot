require('dotenv').config()
import { getConfiguration } from './config'
import { registerCronJob } from './cron/registerCronJob'

async function main(): Promise<void> {
  const config = getConfiguration()
  await registerCronJob(config)
  console.log('Cron job registered')
}

main().catch((error) => {
  console.error('Uncaugh exception', error)
  process.exit(727)
})
