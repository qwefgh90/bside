import { BlobPack } from './pack';
import { GithubNode } from '../tree/github-tree-node';

export class WorkspacePack {
    public static of(repositoryId: number, repositoryName: string, commit_sha: string, tree_sha: string, branchName: string, editorPacks: BlobPack[], treePacks: GithubNode[]
        , tabs: string[], selectedNodePath: string){
        const p = new WorkspacePack();
        p.repositoryId = repositoryId;
        p.repositoryName = repositoryName;
        p.commit_sha = commit_sha;
        p.branchName = branchName;
        p.editorPacks = editorPacks;
        p.tabs = tabs;
        p.treePacks = treePacks;
        p.tree_sha = tree_sha;
        p.selectedNodePath = selectedNodePath;
        p.optimize();
        return p;
    }

    private optimize(){
        //trim the url of node. it is not usuful and too long.
        this.treePacks.forEach(v => {
            v.url = '';
        })
    }
    selectedNodePath: string;
    repositoryId: number;
    repositoryName: string;
    commit_sha: string;
    branchName: string;
    editorPacks: BlobPack[];
    treePacks: GithubNode[];
    tabs: string[];
    tree_sha: string;
}