/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import {
  html,
  customElement,
  css,
  property,
  LitElement,
  PropertyValues,
  internalProperty,
  query,
} from 'lit-element';

import { getHand, validateStation } from './card-deck';
import {
  BLACK,
  BLUE,
  CardAndCount,
  GREEN,
  LOCOMOTIVE,
  ORANGE,
  PINK,
  Player,
  RED,
  ValidRouteLengths,
  WHITE,
  YELLOW,
} from '../../utils/ticketToRideTypes';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';
import './card-count';
import { cardsIcon, routeIcon, stationIcon, tunnelIcon } from './my-icons';
import { routeColours, RouteItem, routes, rType } from '../../utils/routes';

import '@material/mwc-select';
import '@material/mwc-list/mwc-list-item';
import { Select } from '@material/mwc-select';

export function findPlayer(player: string, thePlayers: Array<Player>) {
  const thePlayer: Array<Player> = thePlayers.filter(item => {
    return item.name === player;
  });

  return thePlayer[0];
}

interface SortOrder {
  [index: string]: number;
}

export const sortOrder: SortOrder = {
  locomotive: 0,
  red: 1,
  orange: 2,
  yellow: 3,
  green: 4,
  blue: 5,
  pink: 6,
  white: 7,
  black: 8,
};

function fromRoutes() {
  const fromRoutes: Array<string> = [];
  routes.forEach(item => {
    fromRoutes.push(item.from);
    fromRoutes.push(item.to);
  });
  return [...new Set(fromRoutes)];
}

function getColours(colours: Array<routeColours>) {
  const result: Array<string> = [];
  for (const c of colours) {
    if (c === routeColours.wild)
      return [BLACK, BLUE, GREEN, ORANGE, PINK, RED, WHITE, YELLOW, LOCOMOTIVE];
    result.push(c.toString());
  }

  return result;
}

function getRoute(from: string, to: string) {
  const route: Array<RouteItem> = routes.filter(item => {
    return (
      (item.to === to && item.from === from) ||
      (item.from === to && item.to === from)
    );
  });
  return route[0];
}

function checkRoute(
  route: Array<string>,
  routeColour: string,
  routeLocomotives: number
): boolean {
  let locomotives = 0;
  for (const card of route) {
    switch (card) {
      case LOCOMOTIVE:
        locomotives += 1;
        break;

      default:
        if (card !== routeColour) return false;
        break;
    }
  }
  if (routeLocomotives !== 0) return locomotives === routeLocomotives;

  return true;
}

function validateRoute(
  routeType: rType,
  tunnelLaid: boolean,
  route: Array<string>,
  tunnel: Array<string>,
  routeLength: number,
  routeLocomotives: number,
  routeColour: string
): boolean {
  let extraCards = 0;

  switch (routeType) {
    case rType.train:
    case rType.ferry:
      // The cards in the hand must match the colour or contain a locomotive
      if (route.length !== routeLength) return false;
      break;

    case rType.tunnel:
      if (!tunnelLaid) return false;
      for (const card of tunnel) {
        if (card === LOCOMOTIVE || card === routeColour) extraCards += 1;
      }
      if (route.length !== routeLength + extraCards) return false;
      break;
  }
  return checkRoute(route, routeColour, routeLocomotives);
}

@customElement('player-view')
export class PlayerView extends LitElement {
  @query('#hand')
  private theHandElement!: HTMLElement;

  @query('#routeColours')
  private routeColoursList!: Select;

  @property({ type: String })
  private player = '';

  @property({ type: String })
  private whosTurn = '';

  @property({ type: Number })
  private stations = 0;

  @internalProperty()
  private hand: Array<string> = [];

  @internalProperty()
  private tunnel: Array<string> = [];

  @internalProperty()
  private theHand: Array<CardAndCount> = [];

  @internalProperty()
  private route: Array<string> = [];

  @internalProperty()
  private theRoute: Array<CardAndCount> = [];

  @internalProperty()
  private routeValid: boolean = false;

  @internalProperty()
  private stationValid: boolean = false;

  @internalProperty()
  private tunnelLaid: boolean = false;

  @internalProperty()
  private toRoutes: Array<string> = [];

  @internalProperty()
  private fromRoutes: Array<string> = [];

  @internalProperty()
  private routeColours: Array<string> = [];

  @internalProperty()
  private routeFrom: string = '';

  @internalProperty()
  private routeTo: string = '';

  @internalProperty()
  private routeColour: string = '';

  @internalProperty()
  private selectedRoute: RouteItem = {
    to: '',
    from: '',
    length: 0,
    locomotives: 0,
    colour: [routeColours.wild],
    routeType: rType.ferry,
  };

  static get styles() {
    return [
      SharedStyles,
      css`
        mwc-icon {
          --mdc-icon-size: 12px;
        }

        mwc-button {
          z-index: 1;
        }

        .routeCard {
          --card-size: 50px;
        }

        .iconList {
          width: 25px;
        }
      `,
    ];
  }

  protected render() {
    return html` <section class="top">
        ${this.theHand
          .sort((a, b) => sortOrder[a.name] - sortOrder[b.name])
          .map(item => {
            return html` <card-count
              .card="${item}"
              @clicked-card="${this.cardClicked}"
            ></card-count>`;
          })}
      </section>
      <section class="top">
        <div>
          <mwc-button
            raised
            ?disabled=${!this.routeValid || this.player !== this.whosTurn}
            @click="${this.layTheRoute}"
            >${routeIcon}</mwc-button
          >
          <mwc-button
            raised
            ?disabled=${this.player !== this.whosTurn}
            @click="${this.takeRouteCards}"
            >${cardsIcon}</mwc-button
          >
          <mwc-button
            raised
            ?disabled=${!this.stationValid ||
            this.player !== this.whosTurn ||
            this.tunnelLaid ||
            this.routeFrom === '' ||
            this.routeTo !== ''}
            @click="${this.layStation}"
            >${stationIcon}</mwc-button
          >
        </div>
      </section>
      <section>
        <mwc-select label="From" @selected="${this.fromSelected}">
          ${this.fromRoutes
            .sort()
            .map(
              item =>
                html`<mwc-list-item value="${item}">${item}</mwc-list-item>`
            )}
        </mwc-select>
        <mwc-select
          label="To"
          @selected="${this.toSelected}"
          ?disabled="${this.routeFrom === ''}"
        >
          ${this.toRoutes
            .sort()
            .map(
              item =>
                html`<mwc-list-item
                  ?selected="${this.routeTo === item}"
                  value="${item}"
                  >${item}</mwc-list-item
                >`
            )}
        </mwc-select>
        <mwc-select
          id="routeColours"
          label="Colour"
          @selected="${this.colourSelected}"
          ?disabled="${this.routeTo === '' || this.routeFrom === ''}"
        >
          ${this.routeColours.sort().map(
            item =>
              html`<mwc-list-item
                ?selected="${item == this.routeColour}"
                value="${item}"
              >
                <mwc-icon>
                  <slot>
                    <img
                      class="iconList"
                      src="assets/${item}.webp"
                      alt="${item}"
                      loading="lazy"
                    />
                  </slot>
                </mwc-icon>
                ${item}
              </mwc-list-item>`
          )}
        </mwc-select>
        <mwc-button
          raised
          ?disabled=${this.selectedRoute.routeType.toString() !== 'tunnel' ||
          this.tunnelLaid}
          @click="${this.layTunnel}"
          >${tunnelIcon}</mwc-button
        >
        <card-count
          class="routeCard"
          ?active="${this.selectedRoute.length -
            this.selectedRoute.locomotives ===
            0 ||
          this.routeColour === '' ||
          this.routeColour === LOCOMOTIVE}"
          .card="${{
            name: this.routeColour,
            count: this.selectedRoute.length - this.selectedRoute.locomotives,
          }}"
          .count="${(
            this.selectedRoute.length - this.selectedRoute.locomotives
          ).toString()}"
        ></card-count>
        <card-count
          class="routeCard"
          ?active="${this.selectedRoute.locomotives === 0}"
          .card="${{
            name: LOCOMOTIVE,
            count:
              this.routeColour === LOCOMOTIVE
                ? this.selectedRoute.length
                : this.selectedRoute.locomotives,
          }}"
          .count="${this.selectedRoute.locomotives.toString()}"
        ></card-count>
      </section>
      <section class="top">
        ${this.theRoute
          .sort((a, b) => sortOrder[a.name] - sortOrder[b.name])
          .map(item => {
            return html`
              <card-count
                .card="${item}"
                @clicked-card="${this.routeClicked}"
              ></card-count>
            `;
          })}
      </section>`;
  }

  private cardClicked(event: CustomEvent) {
    const { card } = event.detail;
    // That the card from the hand and put it in the route
    // Find the card in the hand
    const cardIndex = this.hand.findIndex(item => {
      return card.name === item;
    });
    this.route.push(this.hand.splice(cardIndex, 1)[0]);
    this.theHand = getHand(this.hand);
    this.theRoute = getHand(this.route);
    this.routeValid = validateRoute(
      this.selectedRoute.routeType,
      this.tunnelLaid,
      this.route,
      this.tunnel,
      this.selectedRoute.length,
      this.selectedRoute.locomotives,
      this.routeColour
    );

    this.stationValid = validateStation(getHand(this.route), this.tunnelLaid);
  }

  private routeClicked(event: CustomEvent) {
    const { card } = event.detail;
    // That the card from the hand and put it in the route
    // Find the card in the hand
    const cardIndex = this.route.findIndex(item => {
      return card.name === item;
    });
    this.hand.push(this.route.splice(cardIndex, 1)[0]);
    this.theHand = getHand(this.hand);
    this.theRoute = getHand(this.route);
    this.routeValid = validateRoute(
      this.selectedRoute.routeType,
      this.tunnelLaid,
      this.route,
      this.tunnel,
      this.selectedRoute.length,
      this.selectedRoute.locomotives,
      this.routeColour
    );
    this.stationValid = validateStation(getHand(this.route), this.tunnelLaid);
  }

  protected firstUpdated(_changedProperties: any) {
    this.fromRoutes = fromRoutes();
  }

  updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('hand')) {
      this.theHand = getHand(this.hand);
    }
  }

  private layStation() {
    const event = new CustomEvent('lay-station', {
      detail: {
        player: this.player,
        cards: this.route,
        station: this.routeFrom,
      },
    });
    this.dispatchEvent(event);
    this.route = [];
    this.theRoute = [];
  }

  private takeRouteCards() {
    const event = new CustomEvent('take-route-cards', {
      detail: { player: this.player },
    });
    this.dispatchEvent(event);
  }

  private layTunnel() {
    const event = new CustomEvent('lay-tunnel', {
      detail: { player: this.player, cards: this.route },
    });
    this.dispatchEvent(event);
  }

  private layTheRoute() {
    const event = new CustomEvent('lay-route', {
      detail: {
        player: this.player,
        cards: this.route,
        from: this.selectedRoute.from,
        to: this.selectedRoute.to,
      },
    });
    this.dispatchEvent(event);
    this.route = [];
    this.theRoute = [];
  }

  private fromSelected(evt: any) {
    this.routeFrom = evt.target.value;
    this.routeTo = '';
    this.routeColour = '';
    this.routeColours = [];

    const destinations: Array<string> = [];

    routes.forEach(item => {
      if (this.routeFrom === item.to) destinations.push(item.from);
    });
    routes.forEach(item => {
      if (this.routeFrom === item.from) destinations.push(item.to);
    });

    this.toRoutes = [...new Set(destinations)];
    if (this.toRoutes.length === 1) this.routeTo = this.toRoutes[0];
  }

  private toSelected(evt: any) {
    this.routeTo = evt.target.value;
    this.routeColour = '';
    this.routeColoursList.select(-1);

    if (this.routeTo !== '') {
      this.selectedRoute = getRoute(this.routeTo, this.routeFrom);

      this.routeColours = getColours(this.selectedRoute.colour);
      if (this.routeColours.length === 1)
        this.routeColour = this.routeColours[0];
    }
  }

  private colourSelected(evt: any) {
    this.routeColour = evt.target.value;

    const route: Array<RouteItem> = routes.filter(item => {
      return (
        (item.to === this.routeTo && item.from === this.routeFrom) ||
        (item.from === this.routeTo && item.to === this.routeFrom)
      );
    });
  }
}
