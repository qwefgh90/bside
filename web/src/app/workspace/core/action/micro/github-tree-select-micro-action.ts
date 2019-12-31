import { MicroAction } from './micro-action';
import { UserAction } from '../user/user-action';

export class GithubTreeSelectMicroAction extends MicroAction<void> {
    constructor(readonly selectedPath: string, parent?: UserAction<any>){
        super(parent);
    }
    toString(){
        return `selectedPath: ${this.selectedPath}`;
    }
}

