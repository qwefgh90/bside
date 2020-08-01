import { createAction, props } from '@ngrx/store';

export const databaseIsReady = createAction(
    `[Indexed DB Service] the database is ready`,
    props<{}>()
);

export const databaseUpgraded = createAction(
    `[Indexed DB Service] the version of database is bumped up`,
    props<{oldVersion: number, newVersion: number}>()
);

export const databaseIsNotSupported = createAction(
    `[Indexed DB Service] when initializing the database, an error have been found`,
    props<{}>()
);

export const databaseUpgradeFailed = createAction(
    `[Indexed DB Service] when upgrading the database, an error have been found`,
    props<{reason: string}>()
);