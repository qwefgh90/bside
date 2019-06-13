import { Observable } from 'rxjs';

export interface Editor {
    setContent(path: string, name: string);
    selectTab(path: string): boolean;
    exist(path: string): boolean;
    getContent(path?: string): string;
    removeContent(path: string): boolean; 
    readonly: boolean
    readonly listOfContents: string[];
    shrinkExpand()
}
