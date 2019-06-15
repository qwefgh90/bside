import { WorkspacePack } from '../workspace/workspace/workspace-pack';
import { InjectionToken } from '@angular/core';

export let DatabaseToken = new InjectionToken<Database>( "Database token" );

export interface Database {
    save(pack: WorkspacePack);
    get(commit_sha: string): WorkspacePack;
}
