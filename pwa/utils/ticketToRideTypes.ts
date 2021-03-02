export interface CardAndCount {
  name: string;
  count: number;
}

export interface PlayerDataItem {
  score: number;
  stations: number;
  cards: number;
  trains: number;
}

export interface PlayerData {
  [index: string]: PlayerDataItem;
}

export interface Game {
  deckCount: number;
  discardCount: number;
  lastCard: string;
  pallet: string;
  tunnel: string;
  whosTurn: string;
  playerData: PlayerData;
  firstCard: Boolean;
}

export interface Player {
  name: string;
  hand: Array<string>;
}

export interface LetterToCard {
  [index: string]: string;
}
