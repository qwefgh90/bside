import { UserAction } from '../user/user-action';

export abstract class MicroAction<T> {
    constructor(readonly parent: UserAction<any>){
    }
    undo: ()=>void;
    data: T;
    error: Error;
    status: Status = Status.PROGRESS;
    succeed(undo:()=>void, data?: T){
        this.undo = undo;
        this.data = data;
        this.status = Status.SUCCESS;
        this.parent.onMicroActionComplete(this);
    }
    fail(error?: Error){
        this.error = error;
        this.status = Status.FAILURE;
        this.parent.onMicroActionComplete(this);
    }
    isSuccessful(){
        return this.status == Status.SUCCESS;
    }
    hasError(){
        return this.status == Status.FAILURE;
    }
    abstract toString(): string;
}

export enum Status{
    SUCCESS,
    FAILURE,
    PROGRESS
}