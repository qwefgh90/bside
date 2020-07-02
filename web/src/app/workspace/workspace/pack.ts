import { NodeStateAction, GithubTreeNode } from '../tree/github-tree-node';

export class BlobPack {
    public static of(commit_sha: string, node: GithubTreeNode, base64?: string): BlobPack{
        let p = new BlobPack();
        p.commit_sha = commit_sha;
        p.state = [...node.state]
        p.path = node.path;
        p.fileName = node.name;
        p.base64 = base64;
        return p;
    }
    commit_sha: string;
    path: string;
    fileName: string;
    base64: string;
    state: Array<NodeStateAction>;
}
