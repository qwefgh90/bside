import { UserActionDispatcher } from './user-action-dispatcher';
import { UserAction } from './user-action';
import { WorkspaceClearMicroAction } from '../micro/workspace-clear-micro-action';

export class ClearAction extends UserAction<string>{
    constructor(origin?: any, dispatcher?: UserActionDispatcher) {
        super(origin, dispatcher);
    }
    protected defineMicroActionList() {
        let a1 = new WorkspaceClearMicroAction(this);
        return [a1];
    }
}