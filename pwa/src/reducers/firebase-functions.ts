import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/functions';
import { notifyMessage } from '../actions/app';
import { store } from '../store';

const local = window.location.hostname === 'localhost';
const databaseURL = local
  ? 'http://localhost:9010/?ns=ticket-to-ride-game-default-rtdb'
  : 'https://ticket-to-ride-game-default-rtdb.europe-west1.firebasedatabase.app';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDhqMyKT-98_g6CTuvbPuZbD8FPACFnWqI',
  authDomain: 'ticket-to-ride-game.firebaseapp.com',
  databaseURL: databaseURL,
  projectId: 'ticket-to-ride-game',
  storageBucket: 'ticket-to-ride-game.appspot.com',
  messagingSenderId: '938373703194',
  appId: '1:938373703194:web:961d1717304d62f23b13a3',
  measurementId: 'G-BVV1037XJY',
};

const fbApp = firebase.initializeApp!(firebaseConfig);
const fbRef = fbApp.database!().ref();
const fbFunctions = fbApp.functions('europe-west2');
if (local) fbFunctions.useFunctionsEmulator('http://localhost:5001');

export const dbMyHand = fbRef.child('hand');
export const dbTheGame = fbRef.child('game');
export const dbDeck = fbRef.child('deck');
export const dbDiscard = fbRef.child('discard');

export function getFbDb(path: string) {
  return fbRef.child(path);
}
export async function getFbData(path: string) {
  const db = fbRef.child(path);
  let data: any;
  const dbData = db
    .once('value')
    .then(snap => {
      data = snap.val();
    })
    .catch(e => console.log('Unable to read data: ' + e));

  await dbData;

  return data;
}

export async function newGame(game: string) {
  const newGame = fbFunctions.httpsCallable('newGame');
  newGame({ game: game }).then(result => {
    console.log(result.data);
  });
}

export async function layRoute(
  game: string,
  player: string,
  cards: Array<string>,
  from: string,
  to: string
) {
  const layRoute = fbFunctions.httpsCallable('layRoute');
  layRoute({
    game: game,
    player: player,
    cards: cards,
    from: from,
    to: to,
  }).then(result => {
    console.log(result.data);
  });
}

export async function takeTopCard(game: string, player: string) {
  const takeTopCard = fbFunctions.httpsCallable('takeTopCard');
  takeTopCard({ game: game, player: player }).then(result => {
    console.log(result.data);
  });
}

export async function layStation(
  game: string,
  player: string,
  cards: Array<string>,
  station: string
) {
  const layStation = fbFunctions.httpsCallable('layStation');
  layStation({
    game: game,
    player: player,
    cards: cards,
    station: station,
  }).then(result => {
    console.log(result.data);
  });
}

export async function layTunnel(
  game: string,
  player: string,
  cards: Array<string>
) {
  const layTunnel = fbFunctions.httpsCallable('layTunnel');
  layTunnel({ game: game, player: player, cards: cards }).then(result => {
    console.log(result.data);
  });
}

export async function takeCardFromPallet(
  game: string,
  player: string,
  card: string,
  index: number
) {
  const takeCardFromPallet = fbFunctions.httpsCallable('takeCardFromPallet');
  takeCardFromPallet({
    game: game,
    player: player,
    card: card,
    index: index,
  }).then(result => {
    store.dispatch(notifyMessage(result.data));
    console.log(result.data);
  });
}

export async function addGame(game: string) {
  const addGame = fbFunctions.httpsCallable('addGame');
  addGame({
    game: game,
  }).then(result => {
    console.log(result.data);
  });
}

export async function addPlayerToGame(game: string, player: string) {
  const addPlayerToGame = fbFunctions.httpsCallable('addPlayerToGame');
  addPlayerToGame({
    game: game,
    player: player,
  }).then(result => {
    console.log(result.data);
  });
}

export async function takeRouteCards(game: string, player: string) {
  const takeRouteCards = fbFunctions.httpsCallable('takeRouteCards');
  takeRouteCards({
    game: game,
    player: player,
  }).then(result => {
    console.log(result.data);
  });
}
