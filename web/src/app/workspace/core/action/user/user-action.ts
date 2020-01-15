import { MicroAction } from '../micro/micro-action';
import { Subject } from 'rxjs';
import { UserActionDispatcher } from './user-action-dispatcher';
import { MicroActionComponentMap } from '../micro/micro-action-component-map';

export abstract class UserAction<T> {
    constructor(readonly origin: any, protected dispatcher: UserActionDispatcher){
        if(!dispatcher){
            throw new Error("UserActionDispatcher is not provided.");
        }
    }
    private emitter = new Subject<T>();
    protected succeed(any?: T){
        console.groupEnd();
        this.emitter.next(any);
        this.emitter.complete();
    }
    protected fail(error?){
        console.groupEnd();
        this.emitter.error(error);
    }
    protected recover(){
        let index = this.currentActionIndex-1;
        for(; index>=0; index--){
            let action = this.microActions[index];
            if(!action.undo)
                action.undo();
        }
    }
    protected doMicroAction(microAction: MicroAction<any>){
        let componentConstructor = MicroActionComponentMap.microActionComponentMap.get((microAction as any).constructor);
        let subject: Subject<MicroAction<any>> = MicroActionComponentMap.microComponentSubjectMap.get(componentConstructor);
        subject.next(microAction);
        //micro actions
    }
    protected currentActionIndex = 0;
    protected max;
    protected microActions: MicroAction<any>[];
    protected abstract defineMicroActionList(): MicroAction<any>[];
    /**
     * when a micro action is completed, it's invoked.
     */
    onMicroActionComplete(microAction: MicroAction<any>){
        console.debug(`\t[${this.currentActionIndex+1}/${this.max}]${microAction.constructor.name}`, `-> ${microAction.toString()}`);
        let current = this.microActions[this.currentActionIndex];
        if(current != microAction){
            console.error(`A current micro action and a complete micro action doesn't match.`);
        }else{
            if(current.hasError()){
                console.warn(`An error occurs in ${microAction.constructor.name}`, microAction.error);
                this.recover();
                this.fail(microAction.error);
            }else{
                this.currentActionIndex += 1;
                if(this.currentActionIndex < this.max){
                    let microAction = this.microActions[this.currentActionIndex];
                    this.doMicroAction(microAction);
                }else{
                    this.succeed();
                }
            }
        }
    }
    
    start(): Promise<T>{
        this.microActions = this.defineMicroActionList();
        this.max = this.microActions.length;
        if(this.microActions.length == 0){
            throw new Error("There is no defined micro action. ");
        }
        let isSuccessful = this.dispatcher.execute(this);
        if(!isSuccessful)
            this.fail();
        return this.promise();
    }
    _runFirstAction(){
        console.group(`[${this.constructor.name}]`, `${this.origin != undefined ? this.origin.constructor.name : 'unknown'} run the user action`)
        console.debug(`[${this.constructor.name}]`, `${this.origin != undefined ? this.origin.constructor.name : 'unknown'} run the user action`)
        let microAction = this.microActions[this.currentActionIndex];
        this.doMicroAction(microAction);
    }
    promise(): Promise<T>{
        return this.emitter.toPromise();
    }
}