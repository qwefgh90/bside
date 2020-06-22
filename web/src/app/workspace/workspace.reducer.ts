import {GithubNode} from './tree/github-tree-node';
import { createReducer, on, Action } from '@ngrx/store';
import * as workspaceActions from './workspace.actions';
export const workspaceReducerKey = "workspaceReducerKey";

export interface WorkspaceState{
    selectedPath: string;
    selectedNode: GithubNode;
    latestCreatedPath: string;
    latestRemovedPath: string;
    latestRenamedPath: {
        oldPath: string, 
        oldName: string, 
        newPath: string, 
        newName: string
    }
}

export const initialState: WorkspaceState = {
    selectedPath: undefined,
    selectedNode: undefined,
    latestRemovedPath: undefined,
    latestRenamedPath: undefined,
    latestCreatedPath: undefined
}

const _workspaceReducer = createReducer(initialState, 
    on(workspaceActions.clickTab, (state, {path}) => {
        console.debug(`clickTab ${path}`);
        return (state.selectedPath == path ? state : {...state, selectedPath: path}) // use previous state if the path isn't changed
    }),
    on(workspaceActions.nodeSelected, (state, {node}) => {
        console.debug(`nodeSelected ${JSON.stringify(node)}`);
        return {...state, selectedNode: node, selectedPath: node.path};
    }),
    on(workspaceActions.nodeRemoved, (state, {node}) => {
        console.debug(`nodeRemoved ${JSON.stringify(node)}`);
        return {...state, latestRemovedPath: node.path};
    }),
    on(workspaceActions.selectNode, (state, {path}) => {
        console.debug(`selectNode ${JSON.stringify(path)}`);
        return (state.selectedPath == path ? state : {...state, selectedPath: path}) // use previous state if the path isn't changed
    }),
    on(workspaceActions.nodeRenamed, (state, {oldPath, oldName, newPath, newName}) => {
        console.debug(`nodeRenamed ${oldPath}, ${oldName}, ${newPath}, ${newName}`);
        if(oldPath == newPath)
            return state;
        else
            return ({...state, latestRenamedPath: {
            oldName, oldPath, newName, newPath
        }});
    }),
    on(workspaceActions.nodeCreated, (state, {path}) => {
        console.debug(`nodeCreated ${path}`);
        return ({...state, latestCreatedPath: path});
    })
    );

export function workspaceReducer(state: WorkspaceState | undefined, action: Action){
    return _workspaceReducer(state,action);
}