export const TAKE_TOP_CARD_1 = '1st card from top';
export const TAKE_TOP_CARD_2 = '2nd card from top';
export const TAKE_PALLET_CARD_1 = '1st card from pallet';
export const TAKE_PALLET_CARD_2 = '2nd card from pallet';
export const LAY_STATION = 'Lay station';
export const LAY_ROUTE = 'Lay route';
export const LAY_ROUTE_WITH_TUNNEL = 'Lay route with tunnel';
export const LAY_TUNNEL = 'Lay tunnel';
export const TAKE_ROUTE_CARDS = 'Take route cards';

export const BLACK = 'black';
export const BLUE = 'blue';
export const GREEN = 'green';
export const ORANGE = 'orange';
export const PINK = 'pink';
export const RED = 'red';
export const WHITE = 'white';
export const YELLOW = 'yellow';
export const LOCOMOTIVE = 'locomotive';

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
  from: string;
  to: string;
}

export interface Player {
  name: string;
  hand: Array<string>;
}

export interface LetterToCard {
  [index: string]: string;
}

export interface CardAndCount {
  name: string;
  count: number;
}

export const Pack: Array<CardAndCount> = [
  { name: BLACK, count: 12 },
  { name: BLUE, count: 12 },
  { name: GREEN, count: 12 },
  { name: ORANGE, count: 12 },
  { name: PINK, count: 12 },
  { name: RED, count: 12 },
  { name: WHITE, count: 12 },
  { name: YELLOW, count: 12 },
  { name: LOCOMOTIVE, count: 14 },
];

export const LetterToCard: LetterToCard = {
  k: BLACK,
  b: BLUE,
  g: GREEN,
  o: ORANGE,
  p: PINK,
  r: RED,
  w: WHITE,
  y: YELLOW,
  l: LOCOMOTIVE,
};

export const CardToLetter: LetterToCard = {
  black: 'k',
  blue: 'b',
  green: 'g',
  orange: 'o',
  pink: 'p',
  red: 'r',
  white: 'w',
  yellow: 'y',
  locomotive: 'l',
};

export const ValidRouteLengths = [1, 2, 3, 4, 6, 8];

export function getCardsFromString(list: string) {
  const cards: Array<string> = [];
  if (!(list == null)) {
    const listArray = [...list];
    listArray.forEach(card => {
      cards.push(LetterToCard[card]);
    });
  }
  return cards;
}

export function createDeck() {
  const deck: Array<string> = [];
  for (const cardType of Pack) {
    const card: string = cardType.name;
    let count = cardType.count;
    while (count) {
      deck.push(card);
      count -= 1;
    }
  }
  return deck;
}
