import { MicroAction } from './micro-action';
import { UserAction } from '../user/user-action';
import { GithubNode } from 'src/app/workspace/tree/github-tree-node';

export class GithubTreeSnapshotMicroAction extends MicroAction<GithubNode[]> {
    constructor(parent?: UserAction<any>){
        super(parent);
    }
    toString(){
        return ``;
    }
}
