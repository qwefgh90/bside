import { MicroAction } from './micro-action';
import { UserAction } from '../user/user-action';

export class WorkspaceRenameMicroAction extends MicroAction<void> {
    constructor(readonly oldPath: string, readonly oldName: string, readonly newPath: string, readonly newName: string, parent?: UserAction<any>){
        super(parent);
    }
    toString(){
        return `oldPath: ${this.oldPath}, oldName: ${this.oldName}\n newPath: ${this.newPath}, newName: ${this.newName}`;
    }
}