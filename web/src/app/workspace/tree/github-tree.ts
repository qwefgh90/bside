import { GithubTreeNode } from './github-tree-node';

export interface GithubTree {
    selectNode(path: string)
    get(path: string): GithubTreeNode
}
