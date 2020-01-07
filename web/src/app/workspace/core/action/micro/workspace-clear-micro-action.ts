import { UserAction } from '../user/user-action';
import { MicroAction } from './micro-action';

export class WorkspaceClearMicroAction extends MicroAction<void> {
    constructor(parent?: UserAction<any>){
        super(parent);
    }
    toString(){
        return `It clears all changes`;
    }
}
