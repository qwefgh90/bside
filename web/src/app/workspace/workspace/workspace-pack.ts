import { BlobPack } from './pack';
import { GithubNode } from '../tree/github-tree-node';

export class WorkspacePack {
    public static of(repositoryId: number, commit_sha: string, tree_sha: string, branchName: string, editorPacks: BlobPack[], treePacks: GithubNode[]
        , tabs: string[], selectedNodePath: string){
        const p = new WorkspacePack();
        p.repositoryId = repositoryId;
        p.commit_sha = commit_sha;
        p.branchName = branchName;
        p.editorPacks = editorPacks;
        p.tabs = tabs;
        p.treePacks = treePacks;
        p.tree_sha = tree_sha;
        p.selectedNodePath = selectedNodePath;
        return p;
    }
    selectedNodePath: string;
    repositoryId: number;
    commit_sha: string;
    branchName: string;
    editorPacks: BlobPack[];
    treePacks: GithubNode[];
    tabs: string[];
    tree_sha: string;
}
