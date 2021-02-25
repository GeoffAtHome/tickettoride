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
      <h1>Ticket to Ride cards for the game v0.0.1</h1>
      <h3>Background</h3>
      <p>
        This was writen to allow to Ticket to Ride to be played remotely during
        the pandemic (2020 -2021). You still require the board, trains and
        stations to play the game. This PWA manages the deck of cards, discard
        pile and the players hand.
      </p>
      <h3>Starting the game.</h3>
      <p>
        Select 'START' from the menu and enter your name 'player' and the name
        of the game 'game' and the click 'ADD PLAYER'. Other people playing do
        the same from their phones, tablets or other devices. When all players
        who want to play are listed Someone presses 'START GAME' to create the
        game to be played. Following this, everyone presses 'GO TO GAME'
      </p>
      <p>
        IMPORTANT: The 'game' name is important. Using a different name from
        other players will mean each player will be in a different game.
      </p>
      <p>
        Pressing 'START GAME' will reset the game so avoid pressing this
        mid-game.
      </p>
      <h3>Playing the game.</h3>
      <p>The rules from the game have been implemented</p>
      <br />
      <h1>Releases</h1>
      <ul>
        <li>v0.0.1 - Initial version</li>
      </ul>
    `;
  }
}
