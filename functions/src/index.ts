import functions = require("firebase-functions");
import admin = require("firebase-admin");
import {
  CardAndCount,
  Game,
  LetterToCard,
  PlayerData,
  PlayerDataItem,
} from "../../PWA/utils/ticketToRideTypes";
admin.initializeApp(functions.config().firebase);

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

/**
 * Creates a new deck of cards
 * @return {Array<string>} The new, un-shuffled deck of cards
 */
function createDeck() {
  const deck: Array<string> = [];
  for (const cardType of pack) {
    const card: string = cardType.name;
    let { count } = cardType;
    while (count) {
      deck.push(card);
      count -= 1;
    }
  }
  return deck;
}

/**
 * Shuffles a deck of cards
 * @param {Array<string>} deck of cards to shuffle
 * @return {Array<string>} shuffled deck of cards
 */
function shuffleDeck(deck: Array<string>) {
  const shuffledDeck: Array<string> = [];
  while (deck.length !== 0) {
    const cardIndex = Math.floor(Math.random() * deck.length);
    shuffledDeck.push(deck.splice(cardIndex, 1)[0]);
  }
  return shuffledDeck;
}

const pack: Array<CardAndCount> = [
  { name: "black", count: 12 },
  { name: "blue", count: 12 },
  { name: "green", count: 12 },
  { name: "orange", count: 12 },
  { name: "pink", count: 12 },
  { name: "red", count: 12 },
  { name: "white", count: 12 },
  { name: "yellow", count: 12 },
  { name: "locomotive", count: 14 },
];

const letterToCard: LetterToCard = {
  k: "black",
  b: "blue",
  g: "green",
  o: "orange",
  p: "pink",
  r: "red",
  w: "white",
  y: "yellow",
  l: "locomotive",
};

const cardToLetter: LetterToCard = {
  black: "k",
  blue: "b",
  green: "g",
  orange: "o",
  pink: "p",
  red: "r",
  white: "w",
  yellow: "y",
  locomotive: "l",
};

const scoreOnLength = [1, 2, 4, 7, 15, 21];

/**
 * Converts a string to an array of cards
 * @param {string} list to convert
 * @return {Array<string>} cards
 */
function getCardsFromString(list: string) {
  const cards: Array<string> = [];
  if (list !== undefined) {
    const listArray = [...list];
    listArray.forEach((card) => {
      cards.push(letterToCard[card]);
    });
  }

  return cards;
}

/**
 * Converts a string to an array of cards
 * @param {Array<string>} cards to convert
 * @return {string} converted array
 */
export function getStringFromCards(cards: Array<string>) {
  let list: string = "";
  if (cards !== undefined) {
    const listArray: Array<string> = [];
    cards.forEach((card) => {
      listArray.push(cardToLetter[card]);
    });
    list = listArray.join("");
  }
  return list;
}

/**
 * Get hand (card and count) from hand
 * @param {Array<string>} hand of separate cards
 * @return {Array<CardAndCount>} set of cards and count
 */
function getHand(hand: Array<string>): Array<CardAndCount> {
  const set = new Set(hand);
  const sortedHand: Array<CardAndCount> = [];
  set.forEach((cardType) => {
    sortedHand.push({
      name: cardType,
      count: hand.filter((card) => card === cardType).length,
    });
  });

  return sortedHand;
}

/**
 * Get data from Firebase database
 * @param {string} game to get data from
 * @param {string} path to get data from
 * @return {any} data retrieved from database
 */
async function getData(game: string, path: string) {
  const db = admin.database();
  let data: any;
  const dbData = db
    .ref(game + "/" + path)
    .once("value")
    .then((snap) => {
      data = snap.val();
    })
    .catch((e) => console.log("Unable to read data: " + e));

  await dbData;

  return data;
}

/**
 * Write data to Firebase database
 * @param {string} game to write data to
 * @param {string} path to write data to
 * @param {any} data to write
 * @return {PromiseRejectionEventInit} data retrieved from database
 */
async function setData(game: string, path: string, data: any) {
  const db = admin.database();

  const dbData = db
    .ref(game + "/" + path)
    .set(data)
    .then((details) => {
      console.log("Save successful");
    })
    .catch((e) => console.log("Unable to read data: " + e));

  await dbData;
}

/**
 * Gets card from deck of cards.
 * If deck is empty, the discard pile is shuffled and becomes the new deck.
 * The discard pile is then cleared.
 * House keeping is done to update the cards in the deck.
 * @param {string} game to write data to
 * @return {string} card from deck
 */
async function getCard(game: string) {
  // Read the deck
  let deckList = getCardsFromString(await getData(game, "deck"));
  if (deckList.length === 0) {
    // Read the discard list to create new deck
    const discardList = getCardsFromString(await getData(game, "discard"));
    deckList = shuffleDeck(discardList);

    // Save the empty discard list
    await setData(game, "discard", []);

    // Show that the discard pile is empty
    await setData(game, "game/lastCard", "discard");
  }
  // Get the card to return
  const card = deckList.pop();

  // Save the new list
  await setData(game, "deck", getStringFromCards(deckList));

  // Update cards in the deck
  await setData(game, "game/deckCount", deckList.length);

  return card ? card : "";
}

/**
 * End turn by adding to score and moving onto next player
 * @param {string} game to write data to
 * @param {string} player
 * @param {number} cards in hand
 * @param {number} points scored on this turn
 * @param {number} stations used on this turn
 */
async function endTurn(
  game: string,
  player: string,
  cards: number,
  points: number,
  stations: number
) {
  // Update player data
  const path = "game/playerData/" + player;
  const playerData: PlayerDataItem = await getData(game, path);
  playerData.score += points;
  playerData.stations -= stations;
  playerData.cards = cards;

  await setData(game, path, playerData);
  // Move onto next player
  const players: Array<string> = await getData(game, "players");
  const index = (players.indexOf(player) + 1) % players.length;
  await setData(game, "game/firstCard", true);
  await setData(game, "game/whosTurn", players[index]);
}

/**
 * End turn by adding to score and moving onto next player
 * @param {string} game to write data to
 * @param {string} player
 * @param {Array<string>} cards to remove from hand
 * @return {number} cards left in hand
 */
async function removeCardsFromHand(
  game: string,
  player: string,
  cards: Array<string>
) {
  const hand: Array<string> = getCardsFromString(await getData(game, player));
  // Find the cards in hand and remove them
  cards.forEach((card) => {
    const index = hand.indexOf(card);
    hand.splice(index, 1);
  });
  // Save the hand
  await setData(game, player, getStringFromCards(hand));

  // Take the cards and add them to the discard pile
  const discard: Array<string> = getCardsFromString(
    await getData(game, "discard")
  );
  const newDiscard = [...discard, ...cards];

  // Set the size of the discard pile
  await setData(game, "game/discardCount", newDiscard.length);

  // Save the discard pile
  await setData(game, "discard", getStringFromCards(newDiscard));

  // Mark up the last card
  await setData(game, "game/lastCard", cards[0]);
  return hand.length;
}

export const newGame = functions.https.onCall(
  async (data: { game: string }, context) => {
    const { game } = data;

    const deck: Array<string> = shuffleDeck(createDeck());

    const players: Array<string> = await getData(game, "players");

    const playerData: PlayerData = {};
    const playerDataItem: PlayerDataItem = {
      score: 0,
      stations: 3,
      cards: 5,
    };

    players.forEach(async (player) => {
      // Deal the hands
      const hand: Array<string> = [];
      hand.push(deck.pop()!);
      hand.push(deck.pop()!);
      hand.push(deck.pop()!);
      hand.push(deck.pop()!);
      hand.push(deck.pop()!);
      playerData[player] = playerDataItem;
      await setData(game, player, getStringFromCards(hand));
    });

    // Deal the pallet
    const pallet: Array<string> = [];
    pallet.push(deck.pop()!);
    pallet.push(deck.pop()!);
    pallet.push(deck.pop()!);
    pallet.push(deck.pop()!);
    pallet.push(deck.pop()!);

    const theGame: Game = {
      deckCount: deck.length,
      discardCount: 0,
      lastCard: "discard",
      tunnel: "",
      pallet: getStringFromCards(pallet),
      whosTurn: players[0],
      playerData: playerData,
      firstCard: true,
    };

    // Now create the: game, deck and discard piles.
    await setData(game, "game", theGame);
    await setData(game, "deck", getStringFromCards(deck));
    await setData(game, "discard", "");

    return "newGame";
  }
);

export const layRoute = functions.https.onCall(
  async (
    data: { game: string; player: string; cards: Array<string> },
    context
  ) => {
    const { game, player, cards } = data;
    const whosTurn = await getData(game, "game/whosTurn");

    if (whosTurn === player) {
      const cardsLeftInHand = await removeCardsFromHand(game, player, cards);

      // Workout score based on tunnel cards
      const tunnel = getCardsFromString(await getData(game, "game/tunnel"));
      const cardSet = getHand(cards);
      let primaryCard = "";
      // Get dominate card for cards played
      // Set should contain one or two colours and one must be a locomotive
      switch (cardSet.length) {
        case 1:
          primaryCard = cardSet[0].name;
          break;
        case 2:
          primaryCard =
            cardSet[0].name === "locomotive"
              ? cardSet[1].name
              : cardSet[0].name;
          break;
        default:
          console.log("Error in hand");
          break;
      }
      let routeLength = cards.length;
      tunnel.forEach((element) => {
        if (element == primaryCard) routeLength -= 1;
      });

      // End the turn
      await endTurn(
        game,
        player,
        cardsLeftInHand,
        scoreOnLength[routeLength - 1],
        0
      );

      return "success";
    }
    return "Wrong player";
  }
);

export const takeTopCard = functions.https.onCall(
  async (data: { game: string; player: string }, context) => {
    const { game, player } = data;
    const whosTurn = await getData(game, "game/whosTurn");

    if (whosTurn === player) {
      // Take top card and put in hand
      const newCard = await getCard(game);
      const cardLetter = cardToLetter[newCard];

      // Get the players hand
      let hand = await getData(game, player);

      // Add card to hand
      hand += cardLetter;

      // Save the hand
      await setData(game, player, hand);

      // If this is the second card the turn ends
      const firstCard = await getData(game, "game/firstCard");
      if (!firstCard) {
        await endTurn(game, player, hand.length, 0, 0);
      } else {
        await setData(game, "game/firstCard", false);
      }
      return "success";
    }
    return "Wrong player";
  }
);

export const takeCardFromPallet = functions.https.onCall(
  async (
    data: { game: string; player: string; card: string; index: number },
    context
  ) => {
    const { game, player, card, index } = data;
    const whosTurn = await getData(game, "game/whosTurn");

    if (whosTurn === player) {
      // Place the card into players hand
      const cardLetter = cardToLetter[card];

      // Get the players hand
      let hand: string = await getData(game, player);

      // Add card to hand
      hand += cardLetter;

      // Save the hand
      await setData(game, player, hand);

      const pallet: Array<string> = getCardsFromString(
        await getData(game, "game/pallet")
      );
      // Take card from deck and replace in pallet
      const newCard = await getCard(game);

      // Find old card in pallet and replace
      pallet[index] = newCard;

      // Save the pallet
      await setData(game, "game/pallet", getStringFromCards(pallet));

      // If the card is a locomotive or is the second card the turn ends
      const firstCard = await getData(game, "game/firstCard");
      if (card === "locomotive" || !firstCard) {
        await endTurn(game, player, hand.length, 0, 0);
      } else {
        await setData(game, "game/firstCard", false);
      }

      return "success";
    }
    return "Wrong player";
  }
);

export const layStation = functions.https.onCall(
  async (
    data: { game: string; player: string; cards: Array<string> },
    context
  ) => {
    const { game, player, cards } = data;
    const whosTurn = await getData(game, "game/whosTurn");

    console.log("The game: " + game);
    console.log("The player: " + player);
    console.log("Cards: " + JSON.stringify(cards));

    if (whosTurn === player) {
      const cardsLeftInHand = await removeCardsFromHand(game, player, cards);

      // Reduce counts of stations
      await endTurn(game, player, cardsLeftInHand, 0, 1);
      return "success";
    }
    return "Wrong player";
  }
);

export const layTunnel = functions.https.onCall(
  async (data: { game: string; player: string }, context) => {
    const { game, player } = data;
    const whosTurn = await getData(game, "game/whosTurn");

    if (whosTurn === player) {
      // Take three cards and update tunnel
      const tunnel = [];
      tunnel.push(await getCard(game));
      tunnel.push(await getCard(game));
      tunnel.push(await getCard(game));
      // Save the hand
      await setData(game, "game/tunnel", getStringFromCards(tunnel));
      return "success";
    }
    return "Wrong player";
  }
);

export const addGame = functions.https.onCall(
  async (data: { game: string }, context) => {
    const { game } = data;
    let games = await getData("", "__games__");
    if (games === null) games = [];
    if (!games.includes(game)) {
      games.push(game);
      await setData("", "__games__", games);
      return "Game added";
    }
    return "Games already in list";
  }
);

export const addPlayerToGame = functions.https.onCall(
  async (data: { game: string; player: string }, context) => {
    const { game, player } = data;
    let players = await getData(game, "players");
    if (players === null) players = [];
    if (!players.includes(player)) {
      players.push(player);
      await setData(game, "players", players);
      return "Player added";
    }
    return "Player already in game";
  }
);