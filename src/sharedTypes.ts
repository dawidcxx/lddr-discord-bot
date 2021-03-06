export enum LadderType {
  TWOS = '2s',
  THREES = '3s',
}

export enum ClassType {
  DK = 'DK',
  Druid = 'Druid',
  Hunter = 'Hunter',
  Mage = 'Mage',
  Paladin = 'Paladin',
  Priest = 'Priest',
  Rogue = 'Rogue',
  Shaman = 'Shaman',
  Warlock = 'Warlock',
  Warrior = 'Warrior',
}

export type ClassTypes = keyof typeof ClassType

export interface IClosable {
  setup?(): Promise<void>
  close?(): Promise<void>
}
