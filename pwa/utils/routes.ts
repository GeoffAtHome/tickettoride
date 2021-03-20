import { LOCOMOTIVE } from './ticketToRideTypes';

export enum routeColours {
  black = 'black',
  blue = 'blue',
  green = 'green',
  orange = 'orange',
  pink = 'pink',
  red = 'red',
  white = 'white',
  yellow = 'yellow',
  wild = 'wild',
  locomotive = 'locomotive',
}
export enum rType {
  ferry = 'ferry',
  train = 'train',
  tunnel = 'tunnel',
}
export interface RouteItem {
  from: string;
  to: string;
  length: number;
  routeType: rType;
  colour: Array<routeColours>;
  locomotives: number;
}

export const routes: Array<RouteItem> = [
  {
    from: 'Amsterdam',
    to: 'London',
    length: 2,
    routeType: rType.ferry,
    colour: [routeColours.locomotive],
    locomotives: 2,
  },
  {
    from: 'Amsterdam',
    to: 'Frankfurt',
    length: 2,
    routeType: rType.train,
    colour: [routeColours.white],
    locomotives: 0,
  },
  {
    from: 'Angora',
    to: 'Smyrna',
    length: 3,
    routeType: rType.tunnel,
    colour: [routeColours.orange],
    locomotives: 0,
  },
  {
    from: 'Angora',
    to: 'Constantinople',
    length: 2,
    routeType: rType.tunnel,
    colour: [routeColours.wild],
    locomotives: 0,
  },
  {
    from: 'Athina',
    to: 'Brindisi',
    length: 4,
    routeType: rType.ferry,
    colour: [routeColours.wild],
    locomotives: 1,
  },
  {
    from: 'Barcelona',
    to: 'Marseille',
    length: 4,
    routeType: rType.train,
    colour: [routeColours.wild],
    locomotives: 0,
  },
  {
    from: 'Barcelona',
    to: 'Pamplona',
    length: 2,
    routeType: rType.tunnel,
    colour: [routeColours.wild],
    locomotives: 0,
  },
  {
    from: 'Berlin',
    to: 'Frankfurt',
    length: 3,
    routeType: rType.train,
    colour: [routeColours.black, routeColours.red],
    locomotives: 0,
  },
  {
    from: 'Berlin',
    to: 'Wien',
    length: 3,
    routeType: rType.train,
    colour: [routeColours.green],
    locomotives: 0,
  },
  {
    from: 'Brest',
    to: 'Paris',
    length: 3,
    routeType: rType.train,
    colour: [routeColours.black],
    locomotives: 0,
  },
  {
    from: 'Brest',
    to: 'Dieppe',
    length: 2,
    routeType: rType.train,
    colour: [routeColours.orange],
    locomotives: 0,
  },
  {
    from: 'Bruxelles',
    to: 'Paris',
    length: 2,
    routeType: rType.train,
    colour: [routeColours.yellow, routeColours.red],
    locomotives: 0,
  },
  {
    from: 'Bruxelles',
    to: 'Amsterdam',
    length: 1,
    routeType: rType.train,
    colour: [routeColours.black],
    locomotives: 0,
  },
  {
    from: 'Bucuresti',
    to: 'Kyiv',
    length: 4,
    routeType: rType.train,
    colour: [routeColours.wild],
    locomotives: 0,
  },
  {
    from: 'Bucuresti',
    to: 'Sofia',
    length: 2,
    routeType: rType.tunnel,
    colour: [routeColours.wild],
    locomotives: 0,
  },
  {
    from: 'Bucuresti',
    to: 'Budapest',
    length: 4,
    routeType: rType.tunnel,
    colour: [routeColours.wild],
    locomotives: 0,
  },
  {
    from: 'Budapest',
    to: 'Zagrab',
    length: 2,
    routeType: rType.train,
    colour: [routeColours.orange],
    locomotives: 0,
  },
  {
    from: 'Budapest',
    to: 'Sarajevo',
    length: 3,
    routeType: rType.train,
    colour: [routeColours.pink],
    locomotives: 0,
  },
  {
    from: 'Cadiz',
    to: 'Madrid',
    length: 3,
    routeType: rType.train,
    colour: [routeColours.orange],
    locomotives: 0,
  },
  {
    from: 'Constantinople',
    to: 'Sofia',
    length: 3,
    routeType: rType.train,
    colour: [routeColours.blue],
    locomotives: 0,
  },
  {
    from: 'Constantinople',
    to: 'Bucuresti',
    length: 3,
    routeType: rType.train,
    colour: [routeColours.yellow],
    locomotives: 0,
  },
  {
    from: 'Danzig',
    to: 'Berlin',
    length: 4,
    routeType: rType.train,
    colour: [routeColours.wild],
    locomotives: 0,
  },
  {
    from: 'Danzig',
    to: 'Warszawa',
    length: 2,
    routeType: rType.train,
    colour: [routeColours.wild],
    locomotives: 0,
  },
  {
    from: 'Dieppe',
    to: 'London',
    length: 2,
    routeType: rType.ferry,
    colour: [routeColours.wild, routeColours.wild],
    locomotives: 1,
  },
  {
    from: 'Dieppe',
    to: 'Paris',
    length: 1,
    routeType: rType.train,
    colour: [routeColours.pink],
    locomotives: 0,
  },
  {
    from: 'Dieppe',
    to: 'Bruxelles',
    length: 2,
    routeType: rType.train,
    colour: [routeColours.green],
    locomotives: 0,
  },
  {
    from: 'Erzurum',
    to: 'Sevastopol',
    length: 4,
    routeType: rType.ferry,
    colour: [routeColours.wild],
    locomotives: 2,
  },
  {
    from: 'Erzurum',
    to: 'Angora',
    length: 3,
    routeType: rType.train,
    colour: [routeColours.black],
    locomotives: 0,
  },
  {
    from: 'Erzurum',
    to: 'Sochi',
    length: 3,
    routeType: rType.train,
    colour: [routeColours.red],
    locomotives: 0,
  },
  {
    from: 'Essen',
    to: 'Amsterdam',
    length: 3,
    routeType: rType.train,
    colour: [routeColours.yellow],
    locomotives: 0,
  },
  {
    from: 'Essen',
    to: 'Frankfurt',
    length: 2,
    routeType: rType.train,
    colour: [routeColours.green],
    locomotives: 0,
  },
  {
    from: 'Essen',
    to: 'Berlin',
    length: 2,
    routeType: rType.train,
    colour: [routeColours.blue],
    locomotives: 0,
  },
  {
    from: 'Frankfurt',
    to: 'Bruxelles',
    length: 2,
    routeType: rType.train,
    colour: [routeColours.blue],
    locomotives: 0,
  },
  {
    from: 'Frankfurt',
    to: 'Paris',
    length: 3,
    routeType: rType.train,
    colour: [routeColours.white, routeColours.orange],
    locomotives: 0,
  },
  {
    from: 'Frankfurt',
    to: 'Munchen',
    length: 2,
    routeType: rType.train,
    colour: [routeColours.pink],
    locomotives: 0,
  },
  {
    from: 'Kharkov',
    to: 'Moskva',
    length: 4,
    routeType: rType.train,
    colour: [routeColours.wild],
    locomotives: 0,
  },
  {
    from: 'Kharkov',
    to: 'Kyiv',
    length: 4,
    routeType: rType.train,
    colour: [routeColours.wild],
    locomotives: 0,
  },
  {
    from: 'Kobenhavn',
    to: 'Essen',
    length: 3,
    routeType: rType.ferry,
    colour: [routeColours.wild, routeColours.wild],
    locomotives: 1,
  },
  {
    from: 'Kyiv',
    to: 'Smolensk',
    length: 3,
    routeType: rType.train,
    colour: [routeColours.red],
    locomotives: 0,
  },
  {
    from: 'Kyiv',
    to: 'Wilno',
    length: 2,
    routeType: rType.train,
    colour: [routeColours.wild],
    locomotives: 0,
  },
  {
    from: 'Kyiv',
    to: 'Warszawa',
    length: 4,
    routeType: rType.train,
    colour: [routeColours.wild],
    locomotives: 0,
  },
  {
    from: 'Kyiv',
    to: 'Budapest',
    length: 6,
    routeType: rType.tunnel,
    colour: [routeColours.wild],
    locomotives: 0,
  },
  {
    from: 'Lisboa',
    to: 'Cadiz',
    length: 2,
    routeType: rType.train,
    colour: [routeColours.blue],
    locomotives: 0,
  },
  {
    from: 'Lisboa',
    to: 'Madrid',
    length: 3,
    routeType: rType.train,
    colour: [routeColours.pink],
    locomotives: 0,
  },
  {
    from: 'London',
    to: 'Edinburgh',
    length: 4,
    routeType: rType.train,
    colour: [routeColours.black, routeColours.orange],
    locomotives: 0,
  },
  {
    from: 'Madrid',
    to: 'Barcelona',
    length: 2,
    routeType: rType.train,
    colour: [routeColours.yellow],
    locomotives: 0,
  },
  {
    from: 'Madrid',
    to: 'Pamplona',
    length: 3,
    routeType: rType.tunnel,
    colour: [routeColours.white, routeColours.black],
    locomotives: 0,
  },
  {
    from: 'Moskva',
    to: 'Smolensk',
    length: 2,
    routeType: rType.train,
    colour: [routeColours.orange],
    locomotives: 0,
  },
  {
    from: 'Moskva',
    to: 'Petrograd',
    length: 4,
    routeType: rType.train,
    colour: [routeColours.white],
    locomotives: 0,
  },
  {
    from: 'Munchen',
    to: 'Wien',
    length: 3,
    routeType: rType.train,
    colour: [routeColours.orange],
    locomotives: 0,
  },
  {
    from: 'Munchen',
    to: 'Zurich',
    length: 2,
    routeType: rType.tunnel,
    colour: [routeColours.yellow],
    locomotives: 0,
  },
  {
    from: 'Munchen',
    to: 'Venezia',
    length: 2,
    routeType: rType.tunnel,
    colour: [routeColours.blue],
    locomotives: 0,
  },
  {
    from: 'Palermo',
    to: 'Brindisi',
    length: 3,
    routeType: rType.ferry,
    colour: [routeColours.wild],
    locomotives: 1,
  },
  {
    from: 'Pamplona',
    to: 'Marseille',
    length: 4,
    routeType: rType.train,
    colour: [routeColours.red],
    locomotives: 0,
  },
  {
    from: 'Pamplona',
    to: 'Paris',
    length: 4,
    routeType: rType.train,
    colour: [routeColours.blue, routeColours.green],
    locomotives: 1,
  },
  {
    from: 'Pamplona',
    to: 'Brest',
    length: 4,
    routeType: rType.train,
    colour: [routeColours.pink],
    locomotives: 0,
  },
  {
    from: 'Paris',
    to: 'Marseille',
    length: 4,
    routeType: rType.train,
    colour: [routeColours.wild],
    locomotives: 0,
  },
  {
    from: 'Riga',
    to: 'Petrograd',
    length: 4,
    routeType: rType.train,
    colour: [routeColours.wild],
    locomotives: 0,
  },
  {
    from: 'Riga',
    to: 'Danzig',
    length: 3,
    routeType: rType.train,
    colour: [routeColours.black],
    locomotives: 0,
  },
  {
    from: 'Roma',
    to: 'Palermo',
    length: 4,
    routeType: rType.ferry,
    colour: [routeColours.wild],
    locomotives: 1,
  },
  {
    from: 'Roma',
    to: 'Brindisi',
    length: 2,
    routeType: rType.train,
    colour: [routeColours.white],
    locomotives: 0,
  },
  {
    from: 'Roma',
    to: 'Venezia',
    length: 2,
    routeType: rType.train,
    colour: [routeColours.black],
    locomotives: 0,
  },
  {
    from: 'Roma',
    to: 'Marseille',
    length: 4,
    routeType: rType.tunnel,
    colour: [routeColours.wild],
    locomotives: 0,
  },
  {
    from: 'Rostov',
    to: 'Kharkov',
    length: 2,
    routeType: rType.train,
    colour: [routeColours.green],
    locomotives: 0,
  },
  {
    from: 'Rostov',
    to: 'Sevastopol',
    length: 4,
    routeType: rType.tunnel,
    colour: [routeColours.wild],
    locomotives: 0,
  },
  {
    from: 'Sarajevo',
    to: 'Zagrab',
    length: 3,
    routeType: rType.train,
    colour: [routeColours.red],
    locomotives: 0,
  },
  {
    from: 'Sarajevo',
    to: 'Athina',
    length: 4,
    routeType: rType.train,
    colour: [routeColours.green],
    locomotives: 0,
  },
  {
    from: 'Sarajevo',
    to: 'Sofia',
    length: 2,
    routeType: rType.tunnel,
    colour: [routeColours.wild],
    locomotives: 0,
  },
  {
    from: 'Sevastopol',
    to: 'Constantinople',
    length: 4,
    routeType: rType.ferry,
    colour: [routeColours.wild],
    locomotives: 2,
  },
  {
    from: 'Sevastopol',
    to: 'Bucuresti',
    length: 4,
    routeType: rType.train,
    colour: [routeColours.white],
    locomotives: 0,
  },
  {
    from: 'Smyrna',
    to: 'Palermo',
    length: 6,
    routeType: rType.ferry,
    colour: [routeColours.wild],
    locomotives: 2,
  },
  {
    from: 'Smyrna',
    to: 'Athina',
    length: 2,
    routeType: rType.ferry,
    colour: [routeColours.wild],
    locomotives: 1,
  },
  {
    from: 'Smyrna',
    to: 'Constantinople',
    length: 2,
    routeType: rType.tunnel,
    colour: [routeColours.wild],
    locomotives: 0,
  },
  {
    from: 'Sochi',
    to: 'Sevastopol',
    length: 2,
    routeType: rType.ferry,
    colour: [routeColours.wild],
    locomotives: 1,
  },
  {
    from: 'Sochi',
    to: 'Rostov',
    length: 2,
    routeType: rType.train,
    colour: [routeColours.wild],
    locomotives: 0,
  },
  {
    from: 'Sofia',
    to: 'Athina',
    length: 3,
    routeType: rType.train,
    colour: [routeColours.pink],
    locomotives: 0,
  },
  {
    from: 'Stockholm',
    to: 'Kobenhavn',
    length: 3,
    routeType: rType.train,
    colour: [routeColours.yellow, routeColours.white],
    locomotives: 0,
  },
  {
    from: 'Stockholm',
    to: 'Petrograd',
    length: 8,
    routeType: rType.tunnel,
    colour: [routeColours.wild],
    locomotives: 0,
  },
  {
    from: 'Warszawa',
    to: 'Berlin',
    length: 4,
    routeType: rType.train,
    colour: [routeColours.pink, routeColours.yellow],
    locomotives: 0,
  },
  {
    from: 'Warszawa',
    to: 'Wien',
    length: 4,
    routeType: rType.train,
    colour: [routeColours.blue],
    locomotives: 0,
  },
  {
    from: 'Wien',
    to: 'Budapest',
    length: 1,
    routeType: rType.train,
    colour: [routeColours.red, routeColours.white],
    locomotives: 0,
  },
  {
    from: 'Wilno',
    to: 'Smolensk',
    length: 3,
    routeType: rType.train,
    colour: [routeColours.yellow],
    locomotives: 0,
  },
  {
    from: 'Wilno',
    to: 'Warszawa',
    length: 3,
    routeType: rType.train,
    colour: [routeColours.red],
    locomotives: 0,
  },
  {
    from: 'Wilno',
    to: 'Riga',
    length: 4,
    routeType: rType.train,
    colour: [routeColours.green],
    locomotives: 0,
  },
  {
    from: 'Wilno',
    to: 'Petrograd',
    length: 4,
    routeType: rType.train,
    colour: [routeColours.blue],
    locomotives: 0,
  },
  {
    from: 'Zagrab',
    to: 'Wien',
    length: 2,
    routeType: rType.train,
    colour: [routeColours.wild],
    locomotives: 0,
  },
  {
    from: 'Zagrab',
    to: 'Venezia',
    length: 2,
    routeType: rType.train,
    colour: [routeColours.wild],
    locomotives: 0,
  },
  {
    from: 'Zurich',
    to: 'Venezia',
    length: 2,
    routeType: rType.tunnel,
    colour: [routeColours.green],
    locomotives: 0,
  },
  {
    from: 'Zurich',
    to: 'Marseille',
    length: 2,
    routeType: rType.tunnel,
    colour: [routeColours.pink],
    locomotives: 0,
  },
  {
    from: 'Zurich',
    to: 'Paris',
    length: 3,
    routeType: rType.tunnel,
    colour: [routeColours.wild],
    locomotives: 0,
  },
];