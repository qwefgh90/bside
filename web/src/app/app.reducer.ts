import { createReducer, on, Action } from '@ngrx/store';
import { UserType } from './github/wrapper.service';
import * as appActions from './app.actions';

export interface AppState {
    user: UserType
}

export const initialState: AppState = {
    user: undefined
}

const _appReducer = createReducer(initialState,
    on(appActions.updateUserInformation, (state, { user }) => {
        return { ...state, user };
    })
);

export function appReducer(state: AppState | undefined, action: Action) {
    return _appReducer(state, action);
}