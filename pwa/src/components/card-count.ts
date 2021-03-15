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

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';
import { CardAndCount } from '../../utils/ticketToRideTypes';

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
        :host {
          display: block;
          width: var(--card-size);
          height: calc(0.8 * var(--card-size));
        }
        img {
          width: 100%;
          border-radius: 8%;
        }
        mwc-icon-button {
          position: relative;
          top: -15%;
          --mdc-icon-button-size: var(--card-size);
          --mdc-icon-size: var(--card-size);
        }
        .count {
          text-align: center;
          position: relative;
          top: -4px;
          font-size: var(--card-text-size);
        }
      `,
    ];
  }

  protected render() {
    return html`
      <mwc-icon-button raised id="card">
        <slot>
          <img
            src="assets/${this.card.name}.webp"
            alt="${this.card.name}"
            loading="lazy"
          />
          <div class="count">${this.card.count}</div>
        </slot>
      </mwc-icon-button>
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
