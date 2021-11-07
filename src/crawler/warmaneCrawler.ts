import { LadderType } from '../sharedTypes'
import { ICrawler, TeamOverview } from './crawler'
import pup, { Browser } from 'puppeteer'

export class WarmaneCrawler implements ICrawler {
  browser!: Browser

  async getAllTeams(ladder: LadderType): Promise<TeamOverview[]> {
    let result: TeamOverview[] = []
    let pageUrl: string
    switch (ladder) {
      case LadderType.TWOS:
        pageUrl = 'http://armory.warmane.com/'
      case LadderType.THREES:
        pageUrl = 'http://armory.warmane.com/ladder/3v3/1/80'
    }
    const page = await this.browser.newPage()
    try {
      await page.goto(pageUrl)
      result = await page.evaluate(extractTeamOverviews)
    } finally {
      await page.close()
    }
    return result
  }

  async setup(): Promise<void> {
    this.browser = await pup.launch({ headless: false })
  }

  async close(): Promise<void> {
    this.browser.close()
  }
}

function extractTeamOverviews() {
  const CLASS_SRC_TO_CLASS = {
    '1.gif': 'Warrior',
    '2.gif': 'Paladin',
    '3.gif': 'Hunter',
    '4.gif': 'Rogue',
    '5.gif': 'Priest',
    '6.gif': 'DK',
    '7.gif': 'Shaman',
    '8.gif': 'Mage',
    '9.gif': 'Warlock',
  } as const

  const CLASS_SRC_TO_CLASS_KEYS = Object.keys(CLASS_SRC_TO_CLASS) as Array<keyof typeof CLASS_SRC_TO_CLASS>

  function htmlImageToPlayer(el: HTMLImageElement) {
    const classKey = CLASS_SRC_TO_CLASS_KEYS.find((it) => el.src.endsWith(it))
    return {
      name: el.alt,
      class: CLASS_SRC_TO_CLASS[classKey],
    }
  }

  const rows = Array.from(document.querySelector('#data-table').querySelectorAll('tr'))
  return rows
    .map((it) => Array.from(it.querySelectorAll('td')))
    .filter((it) => it.length === 8)
    .map((ladderRow) => {
      let rank = parseInt(ladderRow[0].innerText, 10)
      if (Number.isNaN(rank)) {
        throw new Error(`Failed to parse rank: ${ladderRow[0].innerText}`)
      }

      let name = ladderRow[1].innerText

      let members = Array.from(ladderRow[2].querySelectorAll('img')).map((it) => htmlImageToPlayer(it))

      let realmName = ladderRow[4].innerText

      let win = parseInt(ladderRow[5].innerText, 10)
      if (Number.isNaN(win)) {
        throw new Error(`Failed to parse win: ${ladderRow[5].innerText}`)
      }

      let lose = parseInt(ladderRow[6].innerText, 10)
      if (Number.isNaN(lose)) {
        throw new Error(`Failed to parse lose: ${ladderRow[6].innerText}`)
      }

      let rating = parseInt(ladderRow[7].innerText, 10)
      if (Number.isNaN(rating)) {
        throw new Error(`Failed to parse rating: ${ladderRow[7].innerText}`)
      }

      return {
        rank,
        name,
        members,
        realmName,
        win,
        lose,
        rating,
      }
    })
}
