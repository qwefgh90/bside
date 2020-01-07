import { MicroAction } from './micro-action';
import { UserAction } from '../user/user-action';

export class WorkspaceUndoMicroAction extends MicroAction<void> {
    constructor(readonly path: string, parent?: UserAction<any>){
        super(parent);
    }
    toString(){
        return `path to undo: ${this.path}`;
    }
}
