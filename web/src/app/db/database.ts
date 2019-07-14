import { WorkspacePack } from '../workspace/workspace/workspace-pack';
import { InjectionToken } from '@angular/core';

export let DatabaseToken = new InjectionToken<Database>( "Database token" );

export interface Database {
    save(packProvider: WorkspacePack);
    get(repositoryId: number, commit_sha: string): Promise<WorkspacePack>;
    delete(repositoryId: number, commit_sha: string);
}
