import { UserAction } from './user-action';
import { TabRenameMicroAction } from '../micro/tab-rename-micro-action';
import { MicroActionComponentMap } from '../micro/micro-action-component-map';
import { Subject } from 'rxjs';
import { MicroAction } from '../micro/micro-action';
import { UserActionDispatcher } from './user-action-dispatcher';
import { WorkspaceRenameMicroAction } from '../micro/workspace-rename-micro-action';

export class FileRenameAction extends UserAction<string>{
    constructor(readonly oldPath: string, readonly oldName: string, readonly newPath: string, readonly newName: string, origin: any, dispatcher: UserActionDispatcher) {
        super(origin, dispatcher);
    }
    protected defineMicroActionList() {
        let tabRename = new TabRenameMicroAction(this.oldPath, this.oldName, this.newPath, this.newName, this);
        let workspaceRename = new WorkspaceRenameMicroAction(this.oldPath, this.oldName, this.newPath, this.newName, this);
        return [tabRename, workspaceRename];
    }
}