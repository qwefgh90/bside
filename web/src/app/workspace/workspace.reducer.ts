import { GithubNode, GithubTreeNode } from './tree/github-tree-node';
import { createReducer, on, Action } from '@ngrx/store';
import * as workspaceActions from './workspace.actions';
import { WorkspaceSnapshot } from './core/action/micro/workspace-snapshot-micro-action';
import { TabSnapshot } from './tab/tab-snapshot';
import { GithubTreeSnapshot } from './tree/github-tree-snapshot';
export const workspaceReducerKey = "workspaceReducerKey";

enum SaveStatus{
    READY,
}

export interface WorkspaceState {
    selectedPath: string;
    selectedNode: GithubNode;
    root: GithubTreeNode;
    latestCreatedPath: string;
    latestRemovedPath: string;
    latestRenamingPath: {
        oldPath: string,
        oldName: string,
        newPath: string,
        newName: string
    }
    treeLoaded: boolean;
    editorLoaded: boolean;
    latestSnapshot: {
        requestTime: Date,
        doneTime: Date,
        treeSnapshot: GithubTreeSnapshot,
        workspaceSnapshot: WorkspaceSnapshot,
        tabSnapshot: TabSnapshot
    };
    latestPathForChangesInContent: {
        path: string,
        time: Date
    },
    latestPathToUndo: string,
    latestResetTime: Date
}

export const initialState: WorkspaceState = {
    selectedPath: undefined,
    selectedNode: undefined,
    root: undefined,
    latestRemovedPath: undefined,
    latestRenamingPath: undefined,
    latestCreatedPath: undefined,
    treeLoaded: false,
    editorLoaded: false,
    latestSnapshot: {
        requestTime: undefined,
        doneTime: undefined,
        treeSnapshot: undefined,
        workspaceSnapshot: undefined,
        tabSnapshot: undefined
    },
    latestPathForChangesInContent: {
        path: undefined, 
        time: undefined
    },
    latestPathToUndo: undefined,
    latestResetTime: undefined
}

const _workspaceReducer = createReducer(initialState,
    on(workspaceActions.clickTab, (state, { path }) => {
        return (state.selectedPath == path ? state : { ...state, selectedPath: path }) // use previous state if the path isn't changed
    }),
    on(workspaceActions.nodeSelected, (state, { node }) => {
        return { ...state, selectedNode: node, selectedPath: node?.path };
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
    on(workspaceActions.undo, (state, {path}) => {
        return ({ ...state, latestPathToUndo: path }) // use previous state if the path isn't changed
    }),
    on(workspaceActions.renamingNode, (state, { oldPath, oldName, newPath, newName }) => {
        if (oldPath == newPath)
            return state;
        else
            return ({
                ...state, latestRenamingPath: {
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
    on(workspaceActions.resetWorkspace, (state, {}) => {
        return ({ ...state, latestResetTime: new Date() });
    }),
    on(workspaceActions.editorLoaded, (state, {}) => {
        return ({ ...state, editorLoaded: true });
    }),
    on(workspaceActions.workspaceDestoryed, (state, {}) => {
        return ({ ...initialState });
    }),
    on(workspaceActions.notifyChangesInContent, (state, {path}) => {
        return ({ ...state, latestPathForChangesInContent: {path, time: new Date()} });
    }),
    on(workspaceActions.requestToSave, (state, {}) => {
        let onProgress = state.latestSnapshot.requestTime && !state.latestSnapshot.doneTime;
        return onProgress ? state : ({ ...state, latestSnapshot:
            {...initialState.latestSnapshot, requestTime: new Date()}});
    }),
    on(workspaceActions.updateTabSnapshot, (state, {snapshot}) => {
        let isDone = (snapshot && state.latestSnapshot.treeSnapshot && state.latestSnapshot.workspaceSnapshot);
        return ({ ...state, latestSnapshot: {...state.latestSnapshot, 
            tabSnapshot: snapshot, doneTime: 
                (isDone ? new Date() : undefined)
        }});
    }),
    on(workspaceActions.updateWorkspaceSnapshot, (state, {snapshot}) => {
        let isDone = (snapshot && state.latestSnapshot.tabSnapshot && state.latestSnapshot.treeSnapshot);
        return ({ ...state, latestSnapshot: {...state.latestSnapshot, 
            workspaceSnapshot: snapshot, doneTime: 
            (isDone ? new Date() : undefined)
        }});
    }),
    on(workspaceActions.updateTreeSnapshot, (state, {snapshot}) => {
        let isDone = (snapshot && state.latestSnapshot.tabSnapshot && state.latestSnapshot.workspaceSnapshot);
        return ({ ...state, latestSnapshot: {...state.latestSnapshot, 
            treeSnapshot: snapshot, doneTime: 
            (isDone ? new Date() : undefined)
        }});
    }),
);

export function workspaceReducer(state: WorkspaceState | undefined, action: Action) {
    return _workspaceReducer(state, action);
}