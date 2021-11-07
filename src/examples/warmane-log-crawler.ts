import { WarmaneCrawler } from '../crawler/warmaneCrawler'
import { LadderType } from '../sharedTypes'
import fs from 'fs'

async function main() {
  const crawler = new WarmaneCrawler()
  await crawler.setup()
  const teams = await crawler.getAllTeams(LadderType.THREES)
  console.log('TEAMS', JSON.stringify(teams, null, 2))
  fs.writeFileSync('teams.json', JSON.stringify(teams, null, 2))
  await crawler.close()
}

main().catch((error) => {
  console.error('Uncaugh exception', error)
  process.exit(727)
})
