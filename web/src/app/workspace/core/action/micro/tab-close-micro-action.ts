import { MicroAction } from './micro-action';
import { UserAction } from '../user/user-action';

export class TabCloseMicroAction extends MicroAction<void> {
    constructor(readonly removedPath: string, parent?: UserAction<any>){
        super(parent);
    }
    toString(){
        return `removedPath: ${this.removedPath}`;
    }
}
