import { createAction, props } from '@ngrx/store';
import { GithubNode } from './tree/github-tree-node';

export const clickTab = createAction(
    '[Tab Component] Click the tab',
    props<{path: string}>()
);

export const nodeCreated = createAction(
    '[Github-Tree Component] Node created',
    props<{path: string}>()
);

export const nodeSelected = createAction(
    '[Github-Tree Component] Node selected',
    props<{node: GithubNode}>()
);

export const nodeRemoved = createAction(
    '[Github-Tree Component] Node removed',
    props<{node: GithubNode}>()
)

export const nodeRenamed = createAction(
    '[Github-Tree Component] Node renamed',
    props<{oldPath: string, oldName: string, newPath: string, newName: string}>()
)

export const selectNode = createAction(
    '[Workspace Component] Select the node',
    props<{path: string}>()
);