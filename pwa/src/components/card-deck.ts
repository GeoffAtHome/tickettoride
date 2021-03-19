import {
  CardAndCount,
  LetterToCard,
  LOCOMOTIVE,
  Pack,
  ValidRouteLengths,
} from '../../utils/ticketToRideTypes';
import { OPEN_SNACKBAR } from '../actions/app';

export function shuffleDeck(deck: Array<string>) {
  const shuffledDeck: Array<string> = [];
  while (deck.length !== 0) {
    const cardIndex = Math.floor(Math.random() * deck.length);
    shuffledDeck.push(deck.splice(cardIndex, 1)[0]);
  }

  return shuffledDeck;
}

export function validateRoute(route: Array<CardAndCount>, tunnelLaid: boolean) {
  // A route is valid when all the cards are the same colour. Locomotives are wild
  const set = new Set(route);
  const routeLength = route.reduce((acc: number, obj: CardAndCount): number => {
    return acc + obj.count;
  }, 0);

  if (!tunnelLaid && !ValidRouteLengths.includes(routeLength)) return false;
  if (set.size === 1) return true;
  if (set.size === 2) {
    // Must include a locomotive
    let result = false;
    for (const card of set) {
      if (card.name === LOCOMOTIVE) result = true;
    }

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
