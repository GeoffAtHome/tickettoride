import { html, customElement, css, property, query } from 'lit-element';
import { PageViewElement } from './page-view-element';

// This element is connected to the Redux store.
import { store, RootState } from '../store';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';
import '@material/mwc-textfield';
import { TextField } from '@material/mwc-textfield';
import '@material/mwc-button';
import {
  addGame,
  addPlayerToGame,
  getFbData,
} from '../reducers/firebase-functions';
import { updateUserGameState } from '../actions/app';

@customElement('start-game')
export class StartGame extends PageViewElement {
  @query('#player')
  private playerText!: TextField;

  @query('#game')
  private gameText!: TextField;

  @property({ type: String })
  private gameName: string = '';

  @property({ type: Array })
  private players: Array<string> = [];

  @property({ type: String })
  private player: string = '';

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
      `,
    ];
  }

  protected render() {
    return html`
      <div>
        <mwc-textfield
          id="player"
          dialogInitialFocus
          autoValidate
          maxlength="20"
          validationMessage="Player name required"
          required
          label="Player name"
          @keydown="${this.keydown}"
        ></mwc-textfield>
        <mwc-textfield
          id="game"
          dialogInitialFocus
          autoValidate
          maxlength="20"
          validationMessage="Game name required"
          required
          label="Game Name"
          @keydown="${this.keydown}"
        ></mwc-textfield>
      </div>
      <div class="pallet">
        ${this.players.map((item, index) => {
          return html`
            <div class="players">
              <div>${index + 1}: ${item}</div>
            </div>
          `;
        })}
      </div>

      <div class="top">
        <div>
          <mwc-button raised @click=${this.preStartGame}
            >New game / start game</mwc-button
          >
        </div>
      </div>
    `;
  }

  protected firstUpdated(_changedProperties: any) {
    this.playerText.value = this.player;
    this.gameText.value = this.gameName;
  }

  private keydown(e: KeyboardEvent) {
    if (e.code === 'Enter') {
      this.preStartGame();
    }
  }

  private preStartGame() {
    const player = this.playerText.value.trim();
    const game = this.gameText.value.trim();
    if (player.length !== 0 && game.length !== 0) {
      this.startJoinGame(player, game);
    }
  }

  private async startJoinGame(player: string, game: string) {
    // Get reference to game
    let games: Array<string> = await getFbData('__games__');
    if (games && games.includes(game)) {
      // Existing game - get the players
      const players: Array<string> = await getFbData(game + '/players');
      if (players) {
        // If this play in the list?
        this.players = [...players];
      }
      if (!this.players.includes(player)) {
        this.players.push(player);
        // Save the player
        await addPlayerToGame(game, player);
      }
    } else {
      await addGame(game);
    }
    const theGame = await getFbData(game);
    if (theGame === null) {
      // Add game to list
      await addGame(game);
      // Save the player
      await addPlayerToGame(game, player);
    }
    store.dispatch(updateUserGameState(player, game));
    localStorage.setItem('game', game);
    localStorage.setItem('player', player);
  }
}
