import { WorkspacePack } from './workspace-pack';

export interface WorkspaceChild {
    load(pack: WorkspacePack)
}
