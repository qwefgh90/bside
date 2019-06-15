import { Pack } from './pack';

export class WorkspacePack {
    public static of(commit_sha: string, branchName: string, packs: Pack[], tabs: string[]){
        const p = new WorkspacePack();
        p.commit_sha = commit_sha;
        p.branchName = branchName;
        p.packs = packs;
        p.tabs = tabs;
        return p;
    }
    commit_sha: string;
    branchName: string;
    packs: Pack[];
    tabs: string[];
}
