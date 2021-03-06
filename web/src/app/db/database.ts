import { WorkspacePack } from '../workspace/workspace/workspace-pack';
import { InjectionToken } from '@angular/core';

export let DatabaseToken = new InjectionToken<Database>( "Database token" );

export interface Database {
    save(packProvider: WorkspacePack): Promise<void>;
    saveKV(key: string, value: any);
    getKV(key: string): any;
    get(repositoryId: number, branchName:string, commit_sha: string): Promise<WorkspacePack>;
    list(repositoryId: number): Promise<Array<WorkspacePack>>;
    listAll(): Promise<Array<WorkspacePack>>;
    delete(repositoryId: number, branchName:string, commit_sha: string);
}
