import { BlobPack } from './pack';
import { GithubNode } from '../tree/github-tree-node';
import { nodeCreated } from '../workspace.actions';

export class WorkspacePack {
    public static of(repositoryId: number, repositoryName: string, commit_sha: string, tree_sha: string, branchName: string, editorPacks: BlobPack[], treePacks: GithubNode[]
        , tabs: string[], selectedNodePath: string, autoSave: boolean){
        const p = new WorkspacePack();
        p.repositoryId = repositoryId;
        p.repositoryName = repositoryName;
        p.commit_sha = commit_sha;
        p.branchName = branchName;
        p.editorPacks = editorPacks;
        p.tabs = tabs;
        p.treePacks = treePacks.map((node) => {
            return {...node, url: ''};
        });
        p.tree_sha = tree_sha;
        p.selectedNodePath = selectedNodePath;
        p.autoSave = autoSave;
        p.optimizeTree();
        return p;
    }

    private optimizeTree(){
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
    autoSave: boolean;
}
