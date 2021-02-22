/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, customElement, css } from 'lit-element';
import { PageViewElement } from './page-view-element';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';

@customElement('welcome-page')
export class WelcomePage extends PageViewElement {
  static get styles() {
    return [
      SharedStyles,
      css`
        :host {
          display: block;
          padding: 10px;
        }
      `,
    ];
  }

  protected render() {
    return html`
      <h1>Initial app version v0.0.1</h1>
      <h3>Starting a game</h3>
      <p>
        Enter the name of the game. If it doesn't exist a new game will be
        created, otherwise players in game will be displayed.<br />
        When ready (all players entered), each player clicks start in the order
        of play. The cards are then deal and the game begins with the first
        player ready to play.
      </p>
      <h3>Lay station</h3>
      <p>
        Enabled if you have a station and the right amount of cards picked to
        play a station
      </p>
      <p>When pressed: reduces station count and play cards to discard pick</p>
      <p>Moves onto next player</p>

      <br />
      <h1>Releases</h1>
      <ul>
        <li>v0.0.1 - Initial version</li>
      </ul>
    `;
  }
}
