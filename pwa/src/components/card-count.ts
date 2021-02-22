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
  query,
} from 'lit-element';
// eslint-disable-next-line import/no-duplicates
import '@material/mwc-icon-button';
// eslint-disable-next-line import/no-duplicates
import { IconButton } from '@material/mwc-icon-button';
import { CardAndCount } from './card-deck';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';

@customElement('card-count')
export class CardCount extends LitElement {
  @query('#card')
  private iconButton!: IconButton;

  @property({ type: Object })
  private card!: CardAndCount;

  static get styles() {
    return [
      SharedStyles,
      css`
        img {
          width: 100%;
        }
        mwc-icon-button {
          --mdc-icon-button-size: 200px;
          --mdc-icon-size: 200px;
        }
        .count {
          text-align: center;
          margin-top: -35px;
        }
        .deck {
          height: 200px;
          display: grid;
          grid-template-rows: 1fr auto;
          justify-content: center;
        }
      `,
    ];
  }

  protected render() {
    return html`
      <div class="deck">
        <mwc-icon-button raised id="card">
          <slot>
            <img
              src="${this.card.name}.png"
              alt="deck of cards"
              loading="lazy"
            />
          </slot>
        </mwc-icon-button>
        <div class="count">${this.card.count}</div>
      </div>
    `;
  }

  private cardClicked(card: CardAndCount) {
    const event = new CustomEvent('clicked-card', { detail: { card } });
    this.dispatchEvent(event);
  }

  protected firstUpdated(_changedProperties: any) {
    this.iconButton.addEventListener(
      'click',
      () => {
        this.cardClicked(this.card);
      },
      true
    );
  }
}
