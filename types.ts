
export interface Participant {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  members: Participant[];
}

export interface LotteryResult {
  winner: Participant;
  timestamp: Date;
}

export enum AppView {
  LIST_MANAGEMENT = 'list',
  LUCKY_DRAW = 'draw',
  GROUPING = 'group'
}
