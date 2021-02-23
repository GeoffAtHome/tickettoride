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
} from 'lit-element';
import { getCardsFromString } from './card-deck';
import { PageViewElement } from './page-view-element';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';
import '@material/mwc-button';
import './card-count';
import './card-view';

import './player-view';
import {
  dbMyHand,
  getFbDb,
  layRoute,
  layStation,
  layTunnel,
  newGame,
  takeCardFromPallet,
  takeRouteCards,
  takeTopCard,
} from '../reducers/firebase-functions';
import { Game } from '../../utils/ticketToRideTypes';

@customElement('pallet-card')
export class PalletCard extends PageViewElement {
  @property({ type: Array })
  private pallet: Array<string> = [];

  @property({ type: Array })
  private tunnel: Array<string> = [];

  @property({ type: String })
  private gameName = '';

  @property({ type: String })
  private player = '';

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

  static get styles() {
    return [
      SharedStyles,
      css`
        .parent {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
        }

        mwc-button {
          width: 200px;
        }

        .top {
          display: grid;
          place-items: center;
        }

        img {
          width: 200px;
        }
        .count {
          text-align: center;
        }

        .board {
          display: grid;
          grid-template-columns: minmax(200px, 15%) 1fr 1fr;
        }

        .deck {
          display: grid;
          grid-template-rows: auto 1fr auto;
          justify-content: center;
        }
        .pallet {
          display: grid;
          grid-template-rows: auto;
          justify-content: center;
        }

        .hand {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
        }
      `,
    ];
  }

  protected render() {
    return html`
      <div class="top">
          <mwc-button raised @click="${
            this.startTheGame
          }">Start the Game</mwc-button>
        </div>
      </div>

      <div class="board">
        <div>
          <card-count @clicked-card="${this.takeTopCard}"
            .card="${{ name: 'front', count: this.deckCount }}"
          ></card-count>
          <card-count
            .card="${{ name: this.lastCard, count: this.discardCount }}"
          ></card-count>
        </div>
        <div class="pallet">
          ${this.pallet.map((item, index) => {
            return html` <card-view
              .index=${index}
              .card="${item}"
              @clicked-card="${this.takeCardFromPallet}"
            ></card-view>`;
          })}
        </div>
        <div class="pallet">
          ${this.tunnel.map(item => {
            return html`
              <div class="card">
                <card-view
                  .card="${item}"
                  @clicked-card="${this.tunnelCardClicked}"
                ></card-view>
              </div>
            `;
          })}
        </div>
      </div>

      <div>
        <div class="players">
            <player-view
              @take-cards="${this.takeCards}"
              @take-route-cards="${this.takeRouteCards}"
              @lay-tunnel="${this.layTunnel}"
              @lay-route="${this.layRoute}"
              @lay-station="${this.layStation}"
              .hand="${this.hand}"
              .player="${this.player}"
              .whosTurn="${this.whosTurn}"
              .stations="${this.stations}"
            ></player-view>
            </div>>
      </div>
    `;
  }

  protected firstUpdated(_changedProperties: any) {
    const dbTheGame = getFbDb(this.gameName + '/game');
    dbTheGame.on('value', snap => {
      const theGame: Game = snap.val();
      this.deckCount = theGame.deckCount;
      this.discardCount = theGame.discardCount;
      this.lastCard = theGame.lastCard;
      this.whosTurn = theGame.whosTurn;
      this.tunnel = getCardsFromString(theGame.tunnel);
      this.pallet = getCardsFromString(theGame.pallet);
      this.stations = theGame.playerData[this.player].stations;
    });
    const dbMyHand = getFbDb(this.gameName + '/' + this.player);
    dbMyHand.on('value', snap => {
      const hand = snap.val();
      this.hand = getCardsFromString(hand);
    });
  }

  private takeCards(event: CustomEvent) {
    const { player } = event.detail;
    if (player === this.whosTurn) {
      console.log('takeCards');
    }
  }

  private async takeRouteCards() {
    await takeRouteCards(this.gameName, this.player);
  }

  private async layTunnel() {
    await layTunnel(this.gameName, this.player);
  }

  private async startTheGame() {
    await newGame(this.gameName);
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

  private tunnelCardClicked(event: CustomEvent) {
    const { card } = event.detail;
    this.lastCard = card;

    // When a tunnel card is clicked - move all three tunnel cards to the discard stack
    this.discard = [...this.discard, ...this.tunnel];
    this.tunnel = [];
  }
}
