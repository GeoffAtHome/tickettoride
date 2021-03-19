import functions = require("firebase-functions");
import admin = require("firebase-admin");
import {
  CardAndCount,
  CardToLetter,
  Game,
  LAY_ROUTE,
  LAY_ROUTE_WITH_TUNNEL,
  LAY_STATION,
  LAY_TUNNEL,
  LetterToCard,
  LOCOMOTIVE,
  Pack,
  PlayerData,
  PlayerDataItem,
  TAKE_PALLET_CARD_1,
  TAKE_PALLET_CARD_2,
  TAKE_ROUTE_CARDS,
  TAKE_TOP_CARD_1,
  TAKE_TOP_CARD_2,
} from "../../PWA/utils/ticketToRideTypes";
admin.initializeApp(functions.config().firebase);

/**
 * Creates a new deck of cards
 * @return {Array<string>} The new, un-shuffled deck of cards
 */
function createDeck() {
  const deck: Array<string> = [];
  for (const cardType of Pack) {
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

const scoreOnLength = [
  0, // 0
  1, // 1
  2, // 2
  4, // 3
  7, // 4
  7, // 5 - Not valid
  15, // 6
  15, // 7 - Not valid
  21, // 8
];

/**
 * Converts a string to an array of cards
 * @param {string} list to convert
 * @return {Array<string>} cards
 */
function getCardsFromString(list: string) {
  const cards: Array<string> = [];
  if (!(list == null)) {
    const listArray = [...list];
    listArray.forEach((card) => {
      cards.push(LetterToCard[card]);
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
  if (!(list == null)) {
    const listArray: Array<string> = [];
    cards.forEach((card) => {
      listArray.push(CardToLetter[card]);
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

  // Get the card to return
  const card = deckList.pop();

  // If the deck is now empty - shuffle the cards
  if (deckList.length === 0) {
    // Read the discard list to create new deck
    const discardList = getCardsFromString(await getData(game, "discard"));
    deckList = shuffleDeck(discardList);

    // Save the empty discard list
    await setData(game, "discard", "");
    await setData(game, "discardCount", 0);

    // Show that the discard pile is empty
    await setData(game, "game/lastCard", "discard");
  }

  // Save the new list
  await setData(game, "deck", getStringFromCards(deckList));

  // Update cards in the deck
  await setData(game, "game/deckCount", deckList.length);

  return card ? card : "";
}

function getPrimaryCard(cards: Array<string>) {
  let primaryCard = "";
  // Workout score based on tunnel cards
  const cardSet = getHand(cards);
  // Get dominate card for cards played
  // Set should contain one or two colours and one must be a locomotive
  switch (cardSet.length) {
    case 1:
      primaryCard = cardSet[0].name;
      break;
    case 2:
      primaryCard =
        cardSet[0].name === LOCOMOTIVE ? cardSet[1].name : cardSet[0].name;
      break;
    default:
      console.log("Error in hand");
      break;
  }
  return primaryCard;
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
  routeLength: number,
  stations: number
) {
  const points = routeLength === 0 ? 0 : scoreOnLength[routeLength];

  // Update player data
  const path = "game/playerData/" + player;
  const playerData: PlayerDataItem = await getData(game, path);
  playerData.score += points;
  playerData.stations -= stations;
  playerData.trains -= routeLength;
  playerData.cards = cards;
  await setData(game, path, playerData);
  // Put tunnel cards, if any, onto the discard pile
  await tunnelCardsToDiscardPile(game);
  // Move onto next player
  await nextPlayer(game, player);
}

async function tunnelCardsToDiscardPile(game: string) {
  const tunnel: Array<string> = getCardsFromString(
    await getData(game, "game/tunnel")
  );

  if (tunnel.length !== 0) {
    // Take the cards and add them to the discard pile
    await addCardsToDiscardPile(game, tunnel);

    // Save empty tunnel
    await setData(game, "game/tunnel", "");
  }
}

async function addCardsToDiscardPile(game: string, cards: Array<string>) {
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
}

async function nextPlayer(game: string, player: string) {
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
  await addCardsToDiscardPile(game, cards);

  return hand.length;
}

export const newGame = functions
  .region("europe-west2")
  .https.onCall(async (data: { game: string }, context) => {
    const { game } = data;

    let deck: Array<string> = [];
    let pallet: Array<string> = [];

    for (;;) {
      deck = shuffleDeck(createDeck());

      // Deal the pallet
      pallet = [];
      pallet.push(deck.pop()!);
      pallet.push(deck.pop()!);
      pallet.push(deck.pop()!);
      pallet.push(deck.pop()!);
      pallet.push(deck.pop()!);

      const locomotives = pallet.filter((card) => {
        return card === LOCOMOTIVE;
      });

      if (locomotives.length < 3) break;
    }

    const players: Array<string> = await getData(game, "players");

    const playerData: PlayerData = {};
    const playerDataItem: PlayerDataItem = {
      score: 0,
      stations: 3,
      cards: 5,
      trains: 45,
    };

    players.forEach(async (player) => {
      // Deal the hands - four cards for each player
      const hand: Array<string> = [];
      hand.push(deck.pop()!);
      hand.push(deck.pop()!);
      hand.push(deck.pop()!);
      hand.push(deck.pop()!);
      playerData[player] = playerDataItem;
      await setData(game, player, getStringFromCards(hand));
    });

    const theGame: Game = {
      deckCount: deck.length,
      discardCount: 0,
      lastCard: "discard",
      tunnel: "",
      pallet: getStringFromCards(pallet),
      whosTurn: players[0],
      playerData: playerData,
      firstCard: true,
      lastHand: "",
      lastPlayer: "",
      lastTurn: "",
      from: "",
      to: "",
    };

    // Now create the: game, deck and discard piles.
    await setData(game, "game", theGame);
    await setData(game, "deck", getStringFromCards(deck));
    await setData(game, "discard", "");

    return "newGame";
  });

export const layRoute = functions.region("europe-west2").https.onCall(
  async (
    data: {
      game: string;
      player: string;
      cards: Array<string>;
      from: string;
      to: string;
    },
    context
  ) => {
    const { game, player, cards, from, to } = data;
    const whosTurn = await getData(game, "game/whosTurn");

    if (whosTurn !== player) return `${whosTurn}'s turn.`;

    const cardsLeftInHand = await removeCardsFromHand(game, player, cards);

    // Workout score based on tunnel cards
    const primaryCard = getPrimaryCard(cards);
    let routeLength = cards.length;

    // Workout score based on tunnel cards
    const tunnel: Array<string> = getCardsFromString(
      await getData(game, "game/tunnel")
    );

    // Set up the last turn
    await setData(game, "game/lastPlayer", player);
    await setData(
      game,
      "game/lastTurn",
      tunnel.length === 0 ? LAY_ROUTE : LAY_ROUTE_WITH_TUNNEL
    );
    await setData(game, "game/lastHand", cards);

    tunnel.forEach((element) => {
      if (element === LOCOMOTIVE || element === primaryCard) routeLength -= 1;
    });

    // Save route details
    await setData(game, "game/from", from);
    await setData(game, "game/to", to);

    // End the turn
    await endTurn(game, player, cardsLeftInHand, routeLength, 0);

    return "Route laid";
  }
);

export const takeTopCard = functions
  .region("europe-west2")
  .https.onCall(async (data: { game: string; player: string }, context) => {
    const { game, player } = data;
    const whosTurn = await getData(game, "game/whosTurn");

    if (whosTurn !== player) return `${whosTurn}'s turn.`;

    // Take top card and put in hand
    const newCard = await getCard(game);
    const firstCard = await getData(game, "game/firstCard");

    // Set up the last turn
    await setData(game, "game/lastPlayer", player);
    await setData(
      game,
      "game/lastTurn",
      firstCard ? TAKE_TOP_CARD_1 : TAKE_TOP_CARD_2
    );
    await setData(game, "game/lastHand", firstCard ? "1st card" : "2nd card");

    const cardLetter = CardToLetter[newCard];

    // Get the players hand
    let hand = await getData(game, player);

    // Add card to hand
    hand += cardLetter;

    // Save the hand
    await setData(game, player, hand);

    // If this is the second card the turn ends
    if (!firstCard) {
      await endTurn(game, player, hand.length, 0, 0);
    } else {
      await setData(game, "game/firstCard", false);
    }
    return "Top card taken";
  });

export const takeCardFromPallet = functions
  .region("europe-west2")
  .https.onCall(
    async (
      data: { game: string; player: string; card: string; index: number },
      context
    ) => {
      const { game, player, card, index } = data;
      const whosTurn = await getData(game, "game/whosTurn");

      if (whosTurn !== player) return `${whosTurn}'s turn.`;

      // Need to check if first or second cards
      const firstCard = await getData(game, "game/firstCard");

      // Get the card being played
      const cardLetter = CardToLetter[card];

      // Set up the last turn
      await setData(game, "game/lastPlayer", player);
      await setData(
        game,
        "game/lastTurn",
        firstCard ? TAKE_PALLET_CARD_1 : TAKE_PALLET_CARD_2
      );
      await setData(game, "game/lastHand", card);

      // You cannot draw a locomotive as your second card
      if (card === LOCOMOTIVE && firstCard === false) {
        return "You can't take a locomotive";
      }
      // Place the card into players hand
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

      // If the pallet has three locomotives blow the pallet and try again.
      let locomotives = pallet.filter((card) => {
        return card === LOCOMOTIVE;
      });

      if (locomotives.length >= 3) {
        do {
          // Put the pallet on the discard pile and draw five new cards
          await addCardsToDiscardPile(game, pallet);
          pallet.length = 0;

          pallet.push(await getCard(game));
          pallet.push(await getCard(game));
          pallet.push(await getCard(game));
          pallet.push(await getCard(game));
          pallet.push(await getCard(game));
          locomotives = pallet.filter((card) => {
            return card === LOCOMOTIVE;
          });
        } while (locomotives.length >= 3);
      }

      // Save the pallet
      await setData(game, "game/pallet", getStringFromCards(pallet));

      // If the card is a locomotive or is the second card the turn ends
      if (card === LOCOMOTIVE || !firstCard) {
        await endTurn(game, player, hand.length, 0, 0);
      } else {
        await setData(game, "game/firstCard", false);
      }
      return "Pallet card taken";
    }
  );

export const layStation = functions
  .region("europe-west2")
  .https.onCall(
    async (
      data: { game: string; player: string; cards: Array<string> },
      context
    ) => {
      const { game, player, cards } = data;
      const whosTurn = await getData(game, "game/whosTurn");

      if (whosTurn !== player) return `${whosTurn}'s turn.`;

      // Set up the last turn
      await setData(game, "game/lastPlayer", player);
      await setData(game, "game/lastTurn", LAY_STATION);
      await setData(game, "game/lastHand", cards);

      const cardsLeftInHand = await removeCardsFromHand(game, player, cards);

      // Reduce counts of stations
      await endTurn(game, player, cardsLeftInHand, 0, 1);
      return "Station laid";
    }
  );

export const layTunnel = functions
  .region("europe-west2")
  .https.onCall(
    async (
      data: { game: string; player: string; cards: Array<string> },
      context
    ) => {
      const { game, player, cards } = data;
      const whosTurn = await getData(game, "game/whosTurn");

      if (whosTurn !== player) return `${whosTurn}'s turn.`;

      const primaryCard = getPrimaryCard(cards);
      console.log("Primary card: " + primaryCard);
      console.log("Cards:" + JSON.stringify(cards));

      // Set up the last turn
      await setData(game, "game/lastPlayer", player);
      await setData(game, "game/lastTurn", LAY_TUNNEL);
      await setData(game, "game/lastHand", primaryCard);

      // Take three cards and update tunnel
      const tunnel = [];
      tunnel.push(await getCard(game));
      tunnel.push(await getCard(game));
      tunnel.push(await getCard(game));
      // Save the hand
      await setData(game, "game/tunnel", getStringFromCards(tunnel));
      return "Tunnel cards selected";
    }
  );

export const addGame = functions
  .region("europe-west2")
  .https.onCall(async (data: { game: string }, context) => {
    const { game } = data;
    let games = await getData("", "__games__");
    if (games == null) games = [];
    if (!games.includes(game)) {
      games.push(game);
      await setData("", "__games__", games);
      return "Game added";
    }
    return "Games already in list";
  });

export const addPlayerToGame = functions
  .region("europe-west2")
  .https.onCall(async (data: { game: string; player: string }, context) => {
    const { game, player } = data;
    let players = await getData(game, "players");
    if (players == null) players = [];
    if (!players.includes(player)) {
      players.push(player);
      await setData(game, "players", players);
      return "Player added";
    }
    return "Player already in game";
  });

export const takeRouteCards = functions
  .region("europe-west2")
  .https.onCall(async (data: { game: string; player: string }, context) => {
    const { game, player } = data;
    const whosTurn = await getData(game, "game/whosTurn");

    if (whosTurn !== player) return `${whosTurn}'s turn.`;
    // Set up the last turn
    await setData(game, "game/lastPlayer", player);
    await setData(game, "game/lastTurn", TAKE_ROUTE_CARDS);
    await setData(game, "game/lastHand", "");

    // Get the players hand
    let hand = await getData(game, player);
    await endTurn(game, player, hand.length, 0, 0);
    return "Route cards taken";
  });
