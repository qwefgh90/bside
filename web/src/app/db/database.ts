import { WorkspacePack } from '../workspace/workspace/workspace-pack';
import { InjectionToken } from '@angular/core';

export let DatabaseToken = new InjectionToken<Database>( "Database token" );

export interface Database {
    save(packProvider: WorkspacePack);
    get(repositoryId: number, branchName:string, commit_sha: string): Promise<WorkspacePack>;
    list(repositoryId: number): Promise<Array<WorkspacePack>>
    delete(repositoryId: number, branchName:string, commit_sha: string);
}
