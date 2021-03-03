export const TAKE_TOP_CARD_1 = '1st card from top';
export const TAKE_TOP_CARD_2 = '2nd card from top';
export const TAKE_PALLET_CARD_1 = '1st card from pallet';
export const TAKE_PALLET_CARD_2 = '2nd card from pallet';
export const LAY_STATION = 'Lay station';
export const LAY_ROUTE = 'Lay route';
export const LAY_ROUTE_WITH_TUNNEL = 'Lay route with tunnel';
export const LAY_TUNNEL = 'Lay tunnel';
export const TAKE_ROUTE_CARDS = 'Take route cards';

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
  lastPlayer: string;
  lastTurn: string;
  lastHand: string;
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
