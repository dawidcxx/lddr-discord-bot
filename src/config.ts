import { requireNotNull } from './utils/requireNotNull'

export interface IConfig {
  discordToken: string
}

let configuration: null | IConfig = null

export function getConfiguration(): IConfig {
  if (configuration === null) {
    configuration = {
      discordToken: requireNotNull(process.env['DISCORD_BOT_TOKEN'], 'DISCORD_BOT_TOKEN'),
    }
  }
  return configuration
}
