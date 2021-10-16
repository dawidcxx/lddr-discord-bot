import { IAnalysisReport } from '../analyzer/analyzer'
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
              await channel.send(`Team: '${analysis.teamNow.name}' rating change detected '${analysis.ratingDiff}'`)
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
