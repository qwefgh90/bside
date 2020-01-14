import { UserAction } from './user-action';
import { UserActionDispatcher } from './user-action-dispatcher';
import { TabSelectAction } from '../micro/tab-select-action';
import { WorkspaceSelectMicroAction } from '../micro/workspace-select-micro-action';
import { GithubTreeSelectMicroAction } from '../micro/github-tree-select-micro-action';

export class SelectAction  extends UserAction<string>{
    constructor(readonly selectedPath: string, origin: any, dispatcher: UserActionDispatcher) {
        super(origin, dispatcher);
    }
    protected defineMicroActionList() {
        let tabSelectAction = new TabSelectAction(this.selectedPath, this);
        let workspaceSelectMicroAction = new WorkspaceSelectMicroAction(this.selectedPath, this);
        let githubTreeSelectMicroAction = new GithubTreeSelectMicroAction(this.selectedPath, this);
        return [tabSelectAction, workspaceSelectMicroAction, githubTreeSelectMicroAction];
    }
}
