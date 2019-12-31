import { UserAction } from './user-action';
import { UserActionDispatcher } from './user-action-dispatcher';
import { TabCloseMicroAction } from '../micro/tab-close-micro-action';
import { WorkspaceRemoveNodeMicroAction } from '../micro/workspace-remove-node-micro-action';

export class RemoveNode extends UserAction<string>{
    constructor(readonly removedPath: string, origin?: any, dispatcher?: UserActionDispatcher) {
        super(origin, dispatcher);
    }
    protected defineMicroActionList() {
        let a1 = new TabCloseMicroAction(this.removedPath, this);
        let a2 = new WorkspaceRemoveNodeMicroAction(this.removedPath, this);
        return [a1, a2];
    }
}