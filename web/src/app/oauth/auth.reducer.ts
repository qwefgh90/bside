import { Action, createReducer, on } from '@ngrx/store';
import * as loginActions from './auth.actions';
import { environment } from 'src/environments/environment';
import { TextUtil } from '../workspace/text/text-util';

export const authReducerKey = 'auth';

export interface AuthState {
    isPrivate: boolean;
    autoLogin: boolean;
    currentRouteUrl: string;
    redirectUrl: string;
}

export const initialState: AuthState = {
    isPrivate: false,
    autoLogin: false,
    currentRouteUrl: '',
    redirectUrl: ''
};

const _authReducer = createReducer(
    initialState,
    on(loginActions.navigateHere, (state, { autoLogin, isPrivate }) => ({...state, autoLogin, isPrivate })),
    on(loginActions.redirectUrlChanged, (state, { redirectUrl }) => ({...state, redirectUrl })),
    on(loginActions.scopeChanged, (state, { isPrivate }) => ({...state, isPrivate }))
);

export function authReducer(state: AuthState | undefined, action: Action) {
    return _authReducer(state, action);
}