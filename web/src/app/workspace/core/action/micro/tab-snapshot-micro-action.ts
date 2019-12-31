import { MicroAction } from './micro-action';
import { UserAction } from '../user/user-action';

export class TabSnapshotMicroAction extends MicroAction<string[]> {
    constructor(parent?: UserAction<any>){
        super(parent);
    }
    toString(){
        return ``;
    }
}
