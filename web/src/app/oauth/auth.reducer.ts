import { Action, createReducer, on } from '@ngrx/store';
import * as loginActions from './auth.actions';

export const authReducerKey = 'auth';

export interface AuthState {
    isPrivate: boolean;
    autoLogin: boolean;
    currentRouteUrl: string;
    redirectUrl: string;
    accessToken: string;
    isLogin: boolean;
}

export const initialState: AuthState = {
    isPrivate: false,
    autoLogin: false,
    currentRouteUrl: '',
    redirectUrl: '',
    accessToken: '',
    isLogin: false
};

const _authReducer = createReducer(
    initialState,
    on(loginActions.navigateHere, (state, { autoLogin, isPrivate }) => ({...state, autoLogin, isPrivate })),
    on(loginActions.keepRedirectionUrl, (state, { redirectUrl }) => ({...state, redirectUrl })),
    on(loginActions.scopeChanged, (state, { isPrivate }) => ({...state, isPrivate })),
    on(loginActions.signOut, (state, { }) => ({...state, isLogin: false, accessToken: '' })),
    on(loginActions.apiConnectionProblem, (state, { }) => ({...state, isLogin: false, accessToken: '' })),
    on(loginActions.signIn, (state, { accessToken }) => ({...state, accessToken, isLogin: true }))
);

export function authReducer(state: AuthState | undefined, action: Action) {
    return _authReducer(state, action);
}