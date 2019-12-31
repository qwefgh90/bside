import { MicroAction } from './micro-action';
import { UserAction } from '../user/user-action';

export class WorkspaceSelectAction extends MicroAction<void> {
    constructor(readonly selectedPath: string, parent?: UserAction<any>){
        super(parent);
    }
    toString(){
        return `selectedPath: ${this.selectedPath}`;
    }
}
