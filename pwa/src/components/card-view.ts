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

@customElement('card-view')
export class CardView extends LitElement {
  @query('#card')
  private iconButton!: IconButton;

  @property({ type: String })
  private card = '';

  @property({ type: Number })
  private index = 0;

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
          height: 140px;
          display: grid;
          grid-template-rows: auto;
          justify-content: center;
        }
      `,
    ];
  }

  protected render() {
    return html`
      <div class="deck">
        <div>
          <mwc-icon-button raised id="card">
            <slot>
              <img
                src="assets/${this.card}.png"
                alt="${this.card}"
                loading="lazy"
              />
            </slot>
          </mwc-icon-button>
        </div>
      </div>
    `;
  }

  private cardClicked(card: string, index: number) {
    const event = new CustomEvent('clicked-card', { detail: { card, index } });
    this.dispatchEvent(event);
  }

  protected firstUpdated(_changedProperties: any) {
    this.iconButton.addEventListener(
      'click',
      () => {
        this.cardClicked(this.card, this.index);
      },
      true
    );
  }
}
