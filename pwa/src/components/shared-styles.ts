/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { css } from 'lit-element';

export const SharedStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
    --card-size: max(calc(100vw / 8), 100px);
    --card-text-size: 12px;
  }

  section {
    padding: 5px;
    background: var(--app-section-odd-color);
  }

  section > * {
    margin-right: auto;
    margin-left: auto;
  }

  section:nth-of-type(even) {
    background: var(--app-section-even-color);
  }

  h3 {
    font-size: 12px;
    text-align: center;
    margin: 15px;
  }

  h2 {
    font-size: 24px;
    text-align: center;
    color: var(--app-dark-text-color);
  }

  @media (min-width: 460px) {
    h2 {
      font-size: 36px;
    }
  }

  .page {
    display: none;
  }

  .page[active] {
    display: block;
  }

  .top {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  card-count,
  card-view {
    margin: 5px;
  }
`;
