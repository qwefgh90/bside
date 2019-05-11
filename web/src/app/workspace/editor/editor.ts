import { Observable } from 'rxjs';

export interface Editor {
    setContent(path: string, name: string);
    selectTabIfExists(path: string): boolean;
    getContent(): string;
    changes: Observable<void>;
}
