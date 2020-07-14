import { createAction, props } from '@ngrx/store';
import { UserType } from './github/wrapper.service';

export const updateUserInformation = createAction(
  `[App Component] update user information because token's been updated`,
  props<{ user: UserType }>()
);
export const firstDatabaseCreated = createAction(
  `[Indexed DB Service] the first database is created`,
  props<{}>()
);
export const databaseIsReady = createAction(
  `[Indexed DB Service] the database is ready`,
  props<{}>()
);

export const databaseVersionUpdated = createAction(
  `[Indexed DB Service] the version of database is updated`,
  props<{}>()
);
export const databaseErrorFoundWhenInitializing = createAction(
  `[Indexed DB Service] when initializing the database, an error have been found`,
  props<{}>()
);