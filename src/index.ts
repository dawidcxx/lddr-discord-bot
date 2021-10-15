import { registerCronJob } from './cron/registerCronJob'

const cleanUpCron = registerCronJob()

console.log('Cron job registered')

function cleanUp() {
  cleanUpCron()
  console.log('stopping application')
}

process.on('SIGINT', cleanUp)
