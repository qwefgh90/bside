import { UserAction } from './user-action';
import { WorkspaceCreateMicroAction } from '../micro/workspace-create-micro-action';
import { UserActionDispatcher } from './user-action-dispatcher';

export class CreateAction extends UserAction<string>{
    constructor(readonly path: string, origin?: any, dispatcher?: UserActionDispatcher) {
        super(origin, dispatcher);
    }
    protected defineMicroActionList() {
        let workspaceCreateMicroAction = new WorkspaceCreateMicroAction(this.path, this);
        return [workspaceCreateMicroAction];
    }
}