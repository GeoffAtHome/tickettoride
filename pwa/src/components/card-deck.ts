import { LetterToCard } from '../../utils/ticketToRideTypes';

export interface CardAndCount {
  name: string;
  count: number;
}

const pack: Array<CardAndCount> = [
  { name: 'black', count: 12 },
  { name: 'blue', count: 12 },
  { name: 'green', count: 12 },
  { name: 'orange', count: 12 },
  { name: 'pink', count: 12 },
  { name: 'red', count: 12 },
  { name: 'white', count: 12 },
  { name: 'yellow', count: 12 },
  { name: 'locomotive', count: 14 },
];

const letterToCard: LetterToCard = {
  k: 'black',
  b: 'blue',
  g: 'green',
  o: 'orange',
  p: 'pink',
  r: 'red',
  w: 'white',
  y: 'yellow',
  l: 'locomotive',
};

const cardToLetter: LetterToCard = {
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

export function getCardsFromString(list: string) {
  const cards: Array<string> = [];
  if (list !== undefined) {
    const listArray = [...list];
    listArray.forEach(card => {
      cards.push(letterToCard[card]);
    });
  }

  console.log(getStringFromCards(cards));

  return cards;
}

export function getStringFromCards(cards: Array<string>) {
  let list: string = '';
  if (cards !== undefined) {
    const listArray: Array<string> = [];
    cards.forEach(card => {
      listArray.push(cardToLetter[card]);
    });
    list = listArray.join('');
  }
  return list;
}

export function createDeck() {
  const deck: Array<string> = [];
  for (const cardType of pack) {
    const card: string = cardType.name;
    let count = cardType.count;
    while (count) {
      deck.push(card);
      count -= 1;
    }
  }
  return deck;
}

export function shuffleDeck(deck: Array<string>) {
  const shuffledDeck: Array<string> = [];
  while (deck.length !== 0) {
    const cardIndex = Math.floor(Math.random() * deck.length);
    shuffledDeck.push(deck.splice(cardIndex, 1)[0]);
  }

  return shuffledDeck;
}

export function validateRoute(route: Array<CardAndCount>) {
  // A route is valid when all the cards are the same colour. Locomotives are wild
  const set = new Set(route);
  if (set.size === 1) return true;
  if (set.size === 2) {
    // Must include a locomotive
    let result = false;
    set.forEach(card => {
      if (card.name === 'locomotive') result = true;
    });

    return result;
  }

  return false;
}

export function getHand(hand: Array<string>): Array<CardAndCount> {
  const set = new Set(hand);
  const sortedHand: Array<CardAndCount> = [];
  set.forEach(cardType => {
    sortedHand.push({
      name: cardType,
      count: hand.filter(card => card === cardType).length,
    });
  });

  return sortedHand;
}
