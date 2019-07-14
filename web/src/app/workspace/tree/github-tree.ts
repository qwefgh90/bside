import { GithubTreeNode } from './github-tree-node';
import { BlobPack } from '../workspace/pack';
import { WorkspaceChild } from '../workspace/workspace-child';

export interface GithubTree {
    get(path: string): GithubTreeNode
    restore(packs: BlobPack[]);
}
