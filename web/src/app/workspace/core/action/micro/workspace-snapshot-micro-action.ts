import { MicroAction } from './micro-action';
import { UserAction } from '../user/user-action';
import { BlobPack } from 'src/app/workspace/workspace/pack';
import { Database } from 'src/app/db/database';

export class WorkspaceSnapshotMicroAction extends MicroAction<any> {
    constructor(parent?: UserAction<any>) {
        super(parent);
    }
    toString() {
        return ``;
    }
}
export interface WorkspaceSnapshot {
    repositoryId: number,
    repositoryName: string,
    commitSha: string,
    treeSha: string,
    name: string,
    packs: BlobPack[],
    selectedNodePath: string,
    // database: Database,
    autoSave: boolean
}