import { GithubTreeSnapshotMicroAction } from '../micro/github-tree-snapshot-micro-action';
import { TabSnapshotMicroAction } from '../micro/tab-snapshot-micro-action';
import { UserAction } from './user-action';
import { UserActionDispatcher } from './user-action-dispatcher';
import { WorkspaceSnapshotMicroAction } from '../micro/workspace-snapshot-micro-action';
import { WorkspacePack } from 'src/app/workspace/workspace/workspace-pack';

export class SaveAction extends UserAction<string>{
    constructor(origin: any, dispatcher: UserActionDispatcher) {
        super(origin, dispatcher);
        // this.promise().then(() => {
        //     try {
        //         let workspaceSnapshotData = (this.microActions[0] as WorkspaceSnapshotMicroAction).data;
        //         let githubTreeSnapshotData = (this.microActions[1] as GithubTreeSnapshotMicroAction).data;
        //         let tabSnapshotData = (this.microActions[2] as TabSnapshotMicroAction).data;
        //         let pack = WorkspacePack.of(workspaceSnapshotData.repositoryId, workspaceSnapshotData.repositoryName, workspaceSnapshotData.commitSha, workspaceSnapshotData.treeSha, workspaceSnapshotData.name, workspaceSnapshotData.packs, githubTreeSnapshotData, tabSnapshotData, workspaceSnapshotData.selectedNodePath, workspaceSnapshotData.autoSave);
        //         workspaceSnapshotData.database.save(pack);
        //     } catch (error) {
        //         console.error('Saving failed', error);
        //     }
        // })
    }
    protected defineMicroActionList() {
    //     let a1 = new WorkspaceSnapshotMicroAction(this);
    //     let a2 = new GithubTreeSnapshotMicroAction(this);
    //     let a3 = new TabSnapshotMicroAction(this);
    //     return [a1, a2, a3];
        return undefined;
    }
}