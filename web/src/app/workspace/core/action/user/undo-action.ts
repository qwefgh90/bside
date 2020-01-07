import { UserAction } from './user-action';
import { UserActionDispatcher } from './user-action-dispatcher';
import { WorkspaceUndoMicroAction } from '../micro/workspace-undo-micro-action';

export class UndoAction extends UserAction<string>{
    constructor(readonly path: string, origin?: any, dispatcher?: UserActionDispatcher) {
        super(origin, dispatcher);
    }
    protected defineMicroActionList() {
        let a1 = new WorkspaceUndoMicroAction(this.path, this);
        return [a1];
    }
}