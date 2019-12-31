import { UserAction } from './user-action'
import { Subject } from 'rxjs';

export class UserActionDispatcher {
    private queue: UserAction<any>[] = []
    private _current: UserAction<any>;
    private clean() {
        this._current = undefined;
    }
    get current(): UserAction<any> {
        return this._current;
    }
    get isRunning() {
        return this._current != undefined;
    }
    execute(userAction: UserAction<any>): boolean {
        if (!this.isRunning) {
            this.doNext(userAction);
            return true;
        } else {
            if (this.queue.length < 5)
                this.queue.push(userAction);
            return true;
        }
    }
    private doNext(userAction: UserAction<any>) {
        this._current = userAction;
        userAction.promise().finally(async () => {
            let next = this.queue.shift();
            this.clean();
            if (next != undefined) {
                this.doNext(next);
            }
        });
        userAction._runFirstAction();
        return true;
    }
    static readonly default = new UserActionDispatcher();
}