/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { Reducer } from 'redux';
import {
  UPDATE_PAGE,
  UPDATE_OFFLINE,
  OPEN_SNACKBAR,
  CLOSE_SNACKBAR,
  UPDATE_DRAWER_STATE,
  NOTIFY_MESSAGE,
  CHANGE_USER_GAME,
} from '../actions/app.js';
import { RootAction } from '../store.js';

export interface AppState {
  page: string;
  offline: boolean;
  message: string;
  drawerOpened: boolean;
  snackbarOpened: boolean;
  title: string;
  player: string;
  game: string;
}

const INITIAL_STATE: AppState = {
  page: '',
  offline: false,
  message: '',
  drawerOpened: false,
  snackbarOpened: false,
  title: '',
  player: '',
  game: '',
};

const app: Reducer<AppState, RootAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_PAGE:
      return {
        ...state,
        page: action.page,
      };
    case UPDATE_OFFLINE:
      return {
        ...state,
        offline: action.offline,
      };
    case NOTIFY_MESSAGE:
      return {
        ...state,
        message: action.message,
      };

    case UPDATE_DRAWER_STATE:
      return {
        ...state,
        drawerOpened: action.opened,
      };
    case OPEN_SNACKBAR:
      return {
        ...state,
        snackbarOpened: true,
      };
    case CLOSE_SNACKBAR:
      return {
        ...state,
        snackbarOpened: false,
      };
    case CHANGE_USER_GAME:
      return {
        ...state,
        player: action.player,
        game: action.game,
      };
    default:
      return state;
  }
};

export default app;
