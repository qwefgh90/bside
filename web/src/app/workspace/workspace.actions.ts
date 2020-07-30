import { createAction, props } from '@ngrx/store';
import { GithubNode, GithubTreeNode } from './tree/github-tree-node';
import { WorkspaceSnapshot } from './core/action/micro/workspace-snapshot-micro-action';
import { GithubTreeSnapshot } from './tree/github-tree-snapshot';
import { TabSnapshot } from './tab/tab-snapshot';

export const clickTab = createAction(
    '[Tab Component] Click the tab',
    props<{path: string}>()
);

export const nodeSelectedInChangesTree = createAction(
    '[Stage Component] Node selected',
    props<{node: GithubNode | undefined}>()
);

export const nodeCreated = createAction(
    '[Github-Tree Component] Node created',
    props<{path: string}>()
);

export const nodeSelected = createAction(
    '[Github-Tree Component] Node selected',
    props<{node: GithubNode | undefined}>()
);

export const nodeRemoved = createAction(
    '[Github-Tree Component] Node removed',
    props<{node: GithubNode}>()
)

export const renamingNode = createAction(
    '[Github-Tree Component] Renaming node',
    props<{oldPath: string, oldName: string, newPath: string, newName: string}>()
)
export const treeLoaded = createAction(
    '[Github-Tree Component] Tree loaded',
    props<{}>()
)
export const stageLoaded = createAction(
    '[Stage Component] Stage loaded',
    props<{}>()
)
export const stageUnloaded = createAction(
    '[Stage Component] Tree unloaded',
    props<{}>()
)
export const monacoLoaded = createAction(
    '[Workspace Component] Monaco editor loaded',
    props<{}>()
)

export const removedNodeAddedToTree = createAction(
    '[Workspace Component] Add the node to the tree',
    props<{}>()
);

export const selectPath = createAction(
    '[Workspace Component] Select the path',
    props<{path: string}>()
);

export const workspaceDestoryed = createAction(
    '[Workspace Component] An workspace destroyed',
    props<{}>()
);

export const requestToSave = createAction(
    '[Component] Request to save current state',
    props<{}>()
)

export const updateWorkspaceSnapshot = createAction(
    '[Workspace Component] Update the snapshot',
    props<{snapshot: WorkspaceSnapshot}>()
)
export const updateTreeSnapshot = createAction(
    '[Github-Tree Component] Update the snapshot',
    props<{snapshot: GithubTreeSnapshot}>()
)
export const updateTabSnapshot = createAction(
    '[Tab Component] Update the snapshot',
    props<{snapshot: TabSnapshot}>()
)
export const notifyChangesInContent = createAction(
    '[Editor Component] Notify changes in the content',
    props<{path: string}>()
)
export const undo = createAction(
    '[Stage Component] Undo',
    props<{path: string}>()
)
export const resetWorkspace = createAction(
    '[Stage Component] Reset the workspace',
    props<{}>()
)

export const createNewGithubTree = createAction(
    '[Workspace Component] create a new github tree',
    props<{}>()
)

export const tabLoaded = createAction(
    '[Tab Component] All data have been loaded',
    props<{}>()
)

export const editorLoaded = createAction(
    '[Editor Component] All data have been loaded',
    props<{}>()
)