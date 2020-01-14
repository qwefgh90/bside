import { UserAction } from './user-action';
import { UserActionDispatcher } from './user-action-dispatcher';
import { WorkspaceContentChangeMicroAction } from '../micro/workspace-content-change-micro-action';

export class NotifyContentChangeAction extends UserAction<string>{
    constructor(readonly path: string, origin: any, dispatcher: UserActionDispatcher) {
        super(origin, dispatcher);
    }
    protected defineMicroActionList() {
        let a1 = new WorkspaceContentChangeMicroAction(this.path, this);
        return [a1];
    }
}