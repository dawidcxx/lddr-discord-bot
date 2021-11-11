import {
  IAnalysisRatingChange,
  IAnalysisReport,
  IAnalysisRoasterChange,
  IAnalysisTeamAppeared,
  IAnalysisTeamRemoved,
} from '../analyzer/analyzer'
import { Sink } from './Sink'
import { REST } from '@discordjs/rest'
import { Client, Intents, Message, TextBasedChannel, TextBasedChannels } from 'discord.js'

export class DiscordSink implements Sink {
  private readonly channels = new Set<string>()
  private readonly discordApi: REST
  private readonly discordClient: Client

  constructor(private readonly token: string) {
    this.discordApi = new REST({ version: '9' }).setToken(token)
    this.discordClient = new Client({
      intents: new Intents([Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES]),
    })

    this.discordClient.once('ready', () => {
      console.log('Discord Bot is ready')
      this.discordClient.on('message', async (msg) => {
        if (msg.content.startsWith('!')) {
          this.onCommandReceived(msg)
        }
      })
    })
  }

  async onLadderUpdates(report: IAnalysisReport): Promise<void> {
    if (this.discordClient.isReady()) {
      for (const analysis of report.results) {
        for (const [channelId] of this.channels.entries()) {
          const channel = (await this.discordClient.channels.fetch(channelId)) as TextBasedChannels
          switch (analysis.event) {
            case 'rating-change':
              await channel.send(formattRatingChange(analysis))
              break
            case 'roaster-change':
              await channel.send(formatRoastedChange(analysis))
              break
            case 'appeared':
              await channel.send(formatTeamAppeared(analysis))
              break
            case 'removed':
              await channel.send(formatTeamDisappeared(analysis))
              break
          }
        }
      }
    }
  }

  async setup(): Promise<void> {
    await this.discordClient.login(this.token)
  }

  async onCommandReceived(msg: Message): Promise<void> {
    switch (msg.content) {
      case '!LddrRegisterWatcher':
        this.channels.add(msg.channelId)
        msg.reply('Lddr Bot will send notifications to this channel')
        break
      case '!LddrUnregisterWatcher':
        this.channels.delete(msg.channelId)
        msg.reply('Lddr Bot will no longer send notifications to this channel')
        break
    }
  }
}

function formatTeamAppeared(analysis: IAnalysisTeamAppeared): string {
  return `
Team:"**${analysis.teamNow.name}**" (${analysis.teamNow.members.map((it) => it.name).join(', ')})
Event: **Appeared**
`.trim()
}

function formatTeamDisappeared(analysis: IAnalysisTeamRemoved): string {
  return `
Team:"**${analysis.teamBefore.name}**" (${analysis.teamBefore.members.map((it) => it.name).join(', ')})
Event: **Disappeared**
`.trim()
}

function formattRatingChange(analysis: IAnalysisRatingChange) {
  const rank = analysis.teamNow.rank
  const before = analysis.teamBefore.rating
  const now = analysis.teamNow.rating
  const diff = analysis.ratingDiff
  return `
Team: "**${analysis.teamNow.name}**" (${analysis.teamNow.members.map((it) => it.name).join(', ')})
When: **${analysis.when.toLocaleTimeString()}**
Event: **Rating Change**
Data: { Rank = *${rank}*  Before = *${before}* After = *${now}* Diff = **${diff}** }
  `.trim()
}

function formatRoastedChange(analysis: IAnalysisRoasterChange): string {
  const before = analysis.teamBefore.members.map((it) => it.name).join(', ')
  const now = analysis.teamNow.members.map((it) => it.name).join(', ')
  return `
Team:"**${analysis.teamNow.name}**" (${analysis.teamNow.members.map((it) => it.name).join(', ')})
Event: **Roaster Changed**
Data: 
\`\`\`diff
- ${before}
+ ${now}
\`\`\`
  `.trim()
}
