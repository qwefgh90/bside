import { MicroAction } from './micro-action';
import { UserAction } from '../user/user-action';

export class WorkspaceRemoveNodeMicroAction  extends MicroAction<void> {
    constructor(readonly removedPath: string, parent?: UserAction<any>){
        super(parent);
    }
    toString(){
        return `removedPath: ${this.removedPath}`;
    }
}
