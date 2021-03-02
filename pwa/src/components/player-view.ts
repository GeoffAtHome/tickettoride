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

import { getHand, validateRoute } from './card-deck';
import { CardAndCount, Player } from '../../utils/ticketToRideTypes';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';
import './card-count';
import { cardsIcon, routeIcon, stationIcon, tunnelIcon } from './my-icons';

export function findPlayer(player: string, thePlayers: Array<Player>) {
  const thePlayer: Array<Player> = thePlayers.filter(item => {
    return item.name === player;
  });

  return thePlayer[0];
}

interface SortOrder {
  [index: string]: number;
}

const sortOrder: SortOrder = {
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

@customElement('player-view')
export class PlayerView extends LitElement {
  @query('#hand')
  private theHandElement!: HTMLElement;

  @property({ type: String })
  private player = '';

  @property({ type: String })
  private whosTurn = '';

  @property({ type: Number })
  private stations = 0;

  @internalProperty()
  hand: Array<string> = [];

  @internalProperty()
  theHand: Array<CardAndCount> = [];

  @internalProperty()
  route: Array<string> = [];

  @internalProperty()
  theRoute: Array<CardAndCount> = [];

  @internalProperty()
  routeValid: boolean = false;

  static get styles() {
    return [
      SharedStyles,
      css`
        mwc-button {
          z-index: 1;
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
            ?disabled=${this.player !== this.whosTurn}
            @click="${this.takeRouteCards}"
            >${cardsIcon}</mwc-button
          >
          <mwc-button
            raised
            ?disabled=${!this.routeValid || this.player !== this.whosTurn}
            @click="${this.layTheRoute}"
            >${routeIcon}</mwc-button
          >
          <mwc-button
            raised
            ?disabled=${!this.routeValid || this.player !== this.whosTurn}
            @click="${this.layTunnel}"
            >${tunnelIcon}</mwc-button
          >
          <mwc-button
            raised
            ?disabled=${!this.routeValid ||
            this.player !== this.whosTurn ||
            4 - this.stations !== this.route.length}
            @click="${this.layStation}"
            >${stationIcon}</mwc-button
          >
        </div>
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
    this.routeValid = validateRoute(this.theRoute);
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
    this.routeValid = validateRoute(this.theRoute);
  }

  updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('hand')) {
      this.theHand = getHand(this.hand);
    }
  }

  private layStation() {
    const event = new CustomEvent('lay-station', {
      detail: { player: this.player, cards: this.route },
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
      detail: { player: this.player },
    });
    this.dispatchEvent(event);
  }

  private layTheRoute() {
    const event = new CustomEvent('lay-route', {
      detail: { player: this.player, cards: this.route },
    });
    this.dispatchEvent(event);
    this.route = [];
    this.theRoute = [];
  }
}
