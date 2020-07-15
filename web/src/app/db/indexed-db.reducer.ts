import { createReducer, on, Action } from '@ngrx/store';
import * as appActions from './indexed-db.actions';

export interface IndexedDBState {
    ready: boolean;
    isSupported: boolean;
    upgradeIsFailed: boolean;
    upgradeFailedReason: string;
    upgradeInformation: {
        oldVersion: number,
        newVersion: number
    };
}

export const initialState: IndexedDBState = {
    ready: false, isSupported: true, upgradeIsFailed: false,
    upgradeInformation: undefined, upgradeFailedReason: undefined
}

const _indexedDBReducer = createReducer(initialState,
    on(appActions.databaseIsReady, (state, { }) => {
        return { ...state, ready: true };
    }),
    on(appActions.databaseIsNotSupported, (state, { }) => {
        return { ...state, isSupported: false, ready: false };
    }),
    on(appActions.databaseUpgradeFailed, (state, { reason }) => {
        return { ...state, upgradeIsFailed: true, ready: false, upgradeInformation: undefined
        ,upgradeFailedReason: reason };
    }),
    on(appActions.databaseUpgraded, (state, {oldVersion, newVersion }) => {
        return { ...state, upgradeIsFailed: false, upgradeInformation: {oldVersion, newVersion}};
    })
);

export function indexedDBReducer(state: IndexedDBState | undefined, action: Action) {
    return _indexedDBReducer(state, action);
}