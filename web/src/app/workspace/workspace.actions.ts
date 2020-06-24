import { createAction, props } from '@ngrx/store';
import { GithubNode, GithubTreeNode } from './tree/github-tree-node';

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
export const treeLoaded = createAction(
    '[Github-Tree Component] Tree loaded',
    props<{}>()
)

export const routerPathParameterChanged = createAction(
    '[Workspace Component] Select the node',
    props<{path: string}>()
);
export const rootLoaded = createAction(
    '[Workspace Component] A root node loaded',
    props<{root: GithubTreeNode}>()
);