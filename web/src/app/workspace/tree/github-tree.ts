import { GithubTreeNode } from './github-tree-node';
import { BlobPack } from '../workspace/pack';

export interface GithubTree {
    get(path: string): GithubTreeNode
    restore(packs: BlobPack[]);
}
