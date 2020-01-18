import { TabRenameMicroAction } from './tab-rename-micro-action';
import { TabComponent } from 'src/app/workspace/tab/tab.component';
import { Subject } from 'rxjs';
import { MicroAction } from './micro-action';
import { Type } from '@angular/core';
import { WorkspaceRenameMicroAction } from './workspace-rename-micro-action';
import { WorkspaceSelectMicroAction } from './workspace-select-micro-action';
import { TabSelectAction } from './tab-select-action';
import { TabCloseMicroAction } from './tab-close-micro-action';
import { WorkspaceRemoveNodeMicroAction } from './workspace-remove-node-micro-action';
import { GithubTreeSelectMicroAction } from './github-tree-select-micro-action';
import { WorkspaceCreateMicroAction } from './workspace-create-micro-action';
import { WorkspaceContentChangeMicroAction } from './workspace-content-change-micro-action';
import { GithubTreeSnapshotMicroAction } from './github-tree-snapshot-micro-action';
import { TabSnapshotMicroAction } from './tab-snapshot-micro-action';
import { WorkspaceSnapshotMicroAction } from './workspace-snapshot-micro-action';
import { WorkspaceUndoMicroAction } from './workspace-undo-micro-action';
import { WorkspaceClearMicroAction } from './workspace-clear-micro-action';
import { GithubTreeRenameMicroAction } from './github-tree-rename-micro-action';

export class MicroActionComponentMap {
    private static init = false;
    public static microActionComponentMap = new Map<any, SupportedComponents>();
    public static reverseMicroActionComponentMap = new Map<SupportedComponents, any>();
    public static microComponentSubjectMap = new Map<SupportedComponents, Subject<MicroAction<any>>>();
    public static initializeMicroActionMap() {
        if (!this.init) {
            this.setKeyValuePair(GithubTreeSelectMicroAction, SupportedComponents.GithubTreeComponent);
            this.setKeyValuePair(GithubTreeSnapshotMicroAction, SupportedComponents.GithubTreeComponent);
            this.setKeyValuePair(GithubTreeRenameMicroAction, SupportedComponents.GithubTreeComponent);
            this.setKeyValuePair(TabRenameMicroAction, SupportedComponents.TabComponent);
            this.setKeyValuePair(TabSelectAction, SupportedComponents.TabComponent);
            this.setKeyValuePair(TabCloseMicroAction, SupportedComponents.TabComponent);
            this.setKeyValuePair(TabSnapshotMicroAction, SupportedComponents.TabComponent);
            this.setKeyValuePair(WorkspaceRenameMicroAction, SupportedComponents.WorkspaceComponent);
            this.setKeyValuePair(WorkspaceSelectMicroAction, SupportedComponents.WorkspaceComponent);
            this.setKeyValuePair(WorkspaceRemoveNodeMicroAction, SupportedComponents.WorkspaceComponent);
            this.setKeyValuePair(WorkspaceContentChangeMicroAction, SupportedComponents.WorkspaceComponent);
            this.setKeyValuePair(WorkspaceCreateMicroAction, SupportedComponents.WorkspaceComponent);
            this.setKeyValuePair(WorkspaceSnapshotMicroAction, SupportedComponents.WorkspaceComponent);
            this.setKeyValuePair(WorkspaceClearMicroAction, SupportedComponents.WorkspaceComponent);
            this.setKeyValuePair(WorkspaceUndoMicroAction, SupportedComponents.WorkspaceComponent);
            this.initMicroComponentSubjectMap();
            this.init = true;
        }
    }
    private static setKeyValuePair(any1, any2){
        this.microActionComponentMap.set(any1, any2);
        this.reverseMicroActionComponentMap.set(any2, any1);
    }
    private static initMicroComponentSubjectMap(){
        this.microComponentSubjectMap.set(SupportedComponents.TabComponent, new Subject());
        this.microComponentSubjectMap.set(SupportedComponents.WorkspaceComponent, new Subject());
        this.microComponentSubjectMap.set(SupportedComponents.GithubTreeComponent, new Subject());
        this.microComponentSubjectMap.set(SupportedComponents.EditorComponent, new Subject());
    }
    static getSubjectByComponent(component: SupportedComponents): Subject<MicroAction<any>> | undefined{
        return this.microComponentSubjectMap.get(component);
    }
}
export enum SupportedComponents{
    TabComponent,
    WorkspaceComponent,
    GithubTreeComponent,
    EditorComponent
}
MicroActionComponentMap.initializeMicroActionMap();