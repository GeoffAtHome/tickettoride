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
        :host {
          display: block;
          width: var(--card-size);
          height: calc(0.65 * var(--card-size));
        }
        img {
          width: 100%;
          border-radius: 8%;
        }
        mwc-icon-button {
          position: relative;
          top: -16px;
          --mdc-icon-button-size: var(--card-size);
          --mdc-icon-size: var(--card-size);
        }
      `,
    ];
  }

  protected render() {
    return html`
      <mwc-icon-button raised id="card">
        <slot>
          <img
            src="assets/${this.card}.webp"
            alt="${this.card}"
            loading="lazy"
          />
        </slot>
      </mwc-icon-button>
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
