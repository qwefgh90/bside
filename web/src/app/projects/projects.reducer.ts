import { createReducer, on, Action } from '@ngrx/store';
import * as appActions from './projects.actions';

export const projectsReducerKey = "projectsReducerKey";

export interface ProjectsState {
    bookmarkList: Array<string>
}

export const initialState: ProjectsState = {
    bookmarkList: []
}

const _projectsReducer = createReducer(initialState,
    on(appActions.addBookmark, (state, { path }) => {
        return { ...state, bookmarkList: [...state.bookmarkList, path]};
    }),
    on(appActions.removeBookmark, (state, { path }) => {
        let index = state.bookmarkList.indexOf(path);
        return { ...state, bookmarkList: 
            [ ...(index == -1 ? state.bookmarkList : [...state.bookmarkList.slice(0, index), ...state.bookmarkList.slice(index+1)] )] };
    })
);

export function projectsReducer(state: ProjectsState | undefined, action: Action) {
    return _projectsReducer(state, action);
}