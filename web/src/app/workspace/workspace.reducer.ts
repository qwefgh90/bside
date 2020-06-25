import { GithubNode, GithubTreeNode } from './tree/github-tree-node';
import { createReducer, on, Action } from '@ngrx/store';
import * as workspaceActions from './workspace.actions';
export const workspaceReducerKey = "workspaceReducerKey";

export interface WorkspaceState {
    selectedPath: string;
    selectedNode: GithubNode;
    root: GithubTreeNode;
    latestCreatedPath: string;
    latestRemovedPath: string;
    latestRenamedPath: {
        oldPath: string,
        oldName: string,
        newPath: string,
        newName: string
    }
    treeLoaded: boolean;
    editorLoaded: boolean;
}

export const initialState: WorkspaceState = {
    selectedPath: undefined,
    selectedNode: undefined,
    root: undefined,
    latestRemovedPath: undefined,
    latestRenamedPath: undefined,
    latestCreatedPath: undefined,
    treeLoaded: false,
    editorLoaded: false
}

const _workspaceReducer = createReducer(initialState,
    on(workspaceActions.clickTab, (state, { path }) => {
        return (state.selectedPath == path ? state : { ...state, selectedPath: path }) // use previous state if the path isn't changed
    }),
    on(workspaceActions.nodeSelected, (state, { node }) => {
        return { ...state, selectedNode: node, selectedPath: node.path };
    }),
    on(workspaceActions.nodeRemoved, (state, { node }) => {
        return { ...state, latestRemovedPath: node.path };
    }),
    on(workspaceActions.selectPath, (state, { path }) => {
        return (state.selectedPath == path ? state : { ...state, selectedPath: path }) // use previous state if the path isn't changed
    }),
    on(workspaceActions.treeLoaded, (state, { }) => {
        return ({ ...state, treeLoaded: true }) // use previous state if the path isn't changed
    }),
    on(workspaceActions.nodeRenamed, (state, { oldPath, oldName, newPath, newName }) => {
        if (oldPath == newPath)
            return state;
        else
            return ({
                ...state, latestRenamedPath: {
                    oldName, oldPath, newName, newPath
                }
            });
    }),
    on(workspaceActions.nodeCreated, (state, { path }) => {
        return ({ ...state, latestCreatedPath: path });
    }),
    on(workspaceActions.rootLoaded, (state, { root }) => {
        return ({ ...state, root });
    }),
    on(workspaceActions.editorLoaded, (state, {}) => {
        return ({ ...state, editorLoaded: true });
    }),
    on(workspaceActions.workspaceDestoryed, (state, {}) => {
        return ({ ...initialState });
    })
);

export function workspaceReducer(state: WorkspaceState | undefined, action: Action) {
    return _workspaceReducer(state, action);
}