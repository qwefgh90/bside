import { createAction, props } from '@ngrx/store';

export const navigateHere = createAction(
  '[Login Component] Navigate here',
  props<{ autoLogin: boolean; isPrivate: boolean }>()
);

export const scopeChanged = createAction(
  '[Login Component] private changed',
  props<{ isPrivate: boolean }>()
);


export const redirectUrlChanged = createAction(
  '[Login Guard] url changed',
  props<{ redirectUrl: string }>()
);