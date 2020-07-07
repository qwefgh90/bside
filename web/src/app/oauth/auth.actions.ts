import { createAction, props } from '@ngrx/store';
import { UserType } from '../github/wrapper.service';

export const navigateHere = createAction(
  '[Login Component] Navigate here',
  props<{ autoLogin: boolean; isPrivate: boolean }>()
);

export const scopeChanged = createAction(
  '[Login Component] private changed',
  props<{ isPrivate: boolean }>()
);

export const signIn = createAction(
  '[Login Component] sign in',
  props<{ accessToken: string }>()
);

export const signOut = createAction(
  '[Login Component] sign out',
  props<{}>()
);

export const redirectUrlChanged = createAction(
  '[Login Guard] url changed',
  props<{ redirectUrl: string }>()
);