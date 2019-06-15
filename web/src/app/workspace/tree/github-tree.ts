import { GithubTreeNode } from './github-tree-node';
import { Pack } from '../workspace/pack';

export interface GithubTree {
    selectNode(path: string)
    get(path: string): GithubTreeNode
    restore(packs: Pack[]);
}
