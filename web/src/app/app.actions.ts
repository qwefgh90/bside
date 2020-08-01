import { createAction, props } from '@ngrx/store';
import { UserType } from './github/wrapper.service';

export const updateUserInformation = createAction(
  `[App Component] update user information because token's been updated`,
  props<{ user: UserType }>()
);