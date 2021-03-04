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
  internalProperty,
  query,
} from 'lit-element';
import { getCardsFromString, getHand } from './card-deck';
import { PageViewElement } from './page-view-element';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';
import '@material/mwc-dialog';
import '@material/mwc-button';
import './card-count';
import './card-view';

import './player-view';
import {
  getFbDb,
  layRoute,
  layStation,
  layTunnel,
  takeCardFromPallet,
  takeRouteCards,
  takeTopCard,
} from '../reducers/firebase-functions';
import {
  Game,
  LAY_ROUTE,
  LAY_ROUTE_WITH_TUNNEL,
  LAY_STATION,
  LAY_TUNNEL,
  TAKE_PALLET_CARD_1,
  TAKE_PALLET_CARD_2,
  TAKE_ROUTE_CARDS,
  TAKE_TOP_CARD_1,
  TAKE_TOP_CARD_2,
} from '../../utils/ticketToRideTypes';
import { store } from '../store';
import { notifyMessage } from '../actions/app';
import { getItem } from '../../utils/getItem';
import {
  cardsIcon,
  scoreIcon,
  stationIcon,
  trainIcon,
} from '../components/my-icons';
import { Dialog } from '@material/mwc-dialog';
import { sortOrder } from './player-view';

@customElement('pallet-card')
export class PalletCard extends PageViewElement {
  @query('#lastPlayer')
  private dialog!: Dialog;

  @property({ type: Array })
  private pallet: Array<string> = [];

  @property({ type: Array })
  private tunnel: Array<string> = [];

  @property({ type: String })
  private gameName = '';

  @property({ type: String })
  private player = '';

  @property({ type: String })
  page: string = '';

  @internalProperty()
  private hand: Array<string> = [];

  @internalProperty()
  private discard: Array<string> = [];

  @internalProperty()
  private whosTurn = '';

  @internalProperty()
  private lastCard = 'discard';

  @internalProperty()
  private deckCount = 0;

  @internalProperty()
  private discardCount = 0;

  @internalProperty()
  private stations = 0;

  @internalProperty()
  private pPlayers: Array<string> = [];

  @internalProperty()
  private pCards: Array<number> = [];

  @internalProperty()
  private pScores: Array<number> = [];

  @internalProperty()
  private pStations: Array<number> = [];

  @internalProperty()
  private pTrains: Array<number> = [];

  @internalProperty()
  private lastPlayerTurn: string = '';

  @internalProperty()
  private lastPlayer: string = '';

  @internalProperty()
  private lastHand: string = '';

  @internalProperty()
  private lastTurn: string = '';

  static get styles() {
    return [
      SharedStyles,
      css`
        mwc-button {
          width: 200px;
        }

        .player {
          background-color: 'greenyellow';
        }

        .dialog {
          height: var(--card-size);
        }

        .sec-text {
          text-align: left;
          padding: 10px;
          margin: 0;
        }
      `,
    ];
  }

  protected render() {
    return html`
      <mwc-dialog
        id="lastPlayer"
        hideActions
        heading="${this.lastPlayer} - ${this.lastTurn}"
        @click="${this.closeDialog}"
      >
        ${this.getPlayedHand()}
      </mwc-dialog>
      <section class="top">
        ${this.pPlayers.map((item, index) => {
          return html`<div
            style="background-color: ${this.whosTurn === item
              ? 'greenyellow;'
              : ''}"
          >
            ${item}: ${scoreIcon}${this.pScores[index]}
            ${cardsIcon}${this.pCards[index]} ${trainIcon}${this.pTrains[index]}
            ${stationIcon}${this.pStations[index]}
          </div>`;
        })}
      </section>
      <section class="top">
        <card-count
          @clicked-card="${this.takeTopCard}"
          .card="${{ name: 'front', count: this.deckCount }}"
        ></card-count>
        <card-count
          .card="${{ name: this.lastCard, count: this.discardCount }}"
        ></card-count>
      </section>
      <section class="top">
        ${this.pallet.map((item, index) => {
          return html` <card-view
            .index=${index}
            .card="${item}"
            @clicked-card="${this.takeCardFromPallet}"
          ></card-view>`;
        })}
      </section>
      <div class="sec-text">Tunnel cards</div>
      <section class="top">
        ${this.tunnel.map(item => {
          return html` <card-view .card="${item}"></card-view> `;
        })}
      </section>
      <div class="sec-text">Hand</div>
      <section class="top">
        <player-view
          @take-route-cards="${this.takeRouteCards}"
          @lay-tunnel="${this.layTunnel}"
          @lay-route="${this.layRoute}"
          @lay-station="${this.layStation}"
          .hand="${this.hand}"
          .player="${this.player}"
          .whosTurn="${this.whosTurn}"
          .stations="${this.stations}"
        ></player-view>
      </section>
    `;
  }

  protected firstUpdated(_changedProperties: any) {
    if (this.player === '') this.player = getItem('player');
    if (this.gameName === '') this.gameName = getItem('game');
    const dbTheGame = getFbDb(this.gameName + '/game');
    dbTheGame.on('value', snap => {
      const theGame: Game = snap.val();
      if (theGame !== null) {
        this.deckCount = theGame.deckCount;
        this.discardCount = theGame.discardCount;
        this.lastCard = theGame.lastCard;
        this.whosTurn = theGame.whosTurn;
        this.tunnel = getCardsFromString(theGame.tunnel);
        this.pallet = getCardsFromString(theGame.pallet);
        this.stations = theGame.playerData[this.player].stations;
        this.pPlayers = Object.keys(theGame.playerData);
        this.lastPlayer = theGame.lastPlayer;
        this.lastHand = theGame.lastHand;
        this.lastTurn = theGame.lastTurn;
        this.pCards = this.pPlayers.map(
          player => theGame.playerData[player].cards
        );
        this.pScores = this.pPlayers.map(
          player => theGame.playerData[player].score
        );
        this.pStations = this.pPlayers.map(
          player => theGame.playerData[player].stations
        );

        this.pTrains = this.pPlayers.map(
          player => theGame.playerData[player].trains
        );

        if (this.page === 'pallet' && this.lastTurn !== '') this.dialog.show();

        if (this.lastPlayerTurn !== this.whosTurn) {
          // Player has changes
          this.lastPlayerTurn = this.whosTurn;

          if (this.lastPlayerTurn === this.player) {
            store.dispatch(notifyMessage('Your turn'));
          } else {
            store.dispatch(notifyMessage(this.lastPlayerTurn + "'s turn"));
          }
        }
      }
    });
    const dbMyHand = getFbDb(this.gameName + '/' + this.player);
    dbMyHand.on('value', snap => {
      const hand = snap.val();
      this.hand = getCardsFromString(hand);
    });
  }

  private closeDialog() {
    this.dialog.close();
  }

  private async takeRouteCards() {
    await takeRouteCards(this.gameName, this.player);
  }

  private async layTunnel(event: CustomEvent) {
    const { cards, player } = event.detail;
    await layTunnel(this.gameName, player, cards);
  }

  private async takeTopCard() {
    await takeTopCard(this.gameName, this.player);
  }

  private async layStation(event: CustomEvent) {
    const { cards, player } = event.detail;
    await layStation(this.gameName, player, cards);
  }

  private async takeCardFromPallet(event: CustomEvent) {
    const { card, index } = event.detail;
    this.pallet[index] = 'discard';
    await takeCardFromPallet(this.gameName, this.player, card, index);
  }

  private async layRoute(event: CustomEvent) {
    const { cards, player } = event.detail;
    await layRoute(this.gameName, player, cards);
  }

  private getPlayedHand() {
    switch (this.lastTurn) {
      case TAKE_TOP_CARD_1:
      case TAKE_TOP_CARD_2:
        return html`<card-view
          class="dialog"
          card="front"
          @clicked-card="${this.closeDialog}"
        ></card-view>`;

      case TAKE_PALLET_CARD_1:
      case TAKE_PALLET_CARD_2:
      case LAY_STATION:
      case LAY_TUNNEL:
        return html`<card-view
          class="dialog"
          .card=${this.lastHand}
          @clicked-card="${this.closeDialog}"
        ></card-view>`;

      case LAY_ROUTE:
      case LAY_ROUTE_WITH_TUNNEL:
        return getHand([...this.lastHand])
          .sort((a, b) => sortOrder[a.name] - sortOrder[b.name])
          .map(item => {
            return html` <card-count
              class="dialog"
              .card="${item}"
              @clicked-card="${this.closeDialog}"
            ></card-count>`;
          });

      case TAKE_ROUTE_CARDS:
        return html`<div>${cardsIcon}</div>`;
    }
  }
}
