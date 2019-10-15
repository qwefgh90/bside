export interface ReturnData{
    key: number;
    data: any;
}
export interface CallData{
    key: number;
    data: any;
}

export class WebWorkerEx {
    private static promiseTable = new Map<number, {resolve, reject}>()
    private static worker: Worker;
    private static sequencer: number = 0;
    private static generateKey(): number {
        if(WebWorkerEx.sequencer == Number.MAX_SAFE_INTEGER)
            WebWorkerEx.sequencer = 0;
        else
            WebWorkerEx.sequencer++;
        return WebWorkerEx.sequencer;
    }

    private static get(): Worker{
        if(this.worker != undefined)
            return this.worker;
        else if (typeof Worker !== 'undefined') {
            const worker = new Worker('./entry.worker', { type: 'module' });
            worker.onmessage = ({ data }) => {
                try{
                    let returnData = data as ReturnData;
                    // console.log(`page got message: ${returnData}`);
                    let {resolve, reject} = WebWorkerEx.promiseTable.get(returnData.key);
                    WebWorkerEx.promiseTable.delete(returnData.key);
                    //call resolve() of a registered promise.
                    resolve(returnData.data);
                }catch(e){
                    console.error(e);
                }
            };
            worker.onerror = (error) => {
                console.error(error);
            }
            this.worker = worker;
            return worker;
        } else {
            throw new Error(`This platform doesn't support Worker.`)
            // Web Workers are not supported in this environment.
            // You should add a fallback so that your program still executes correctly.
        }
    }

    static compress(data: string): Promise<string>{
        try {
            let worker = WebWorkerEx.get();
            let key = WebWorkerEx.generateKey();
            let promise = new Promise<string>((resolve, reject) => {
                this.promiseTable.set(key, { resolve: resolve, reject: reject });
            })
            worker.postMessage({ key: key, data: data });
            return promise;
        } catch (e) {
            return Promise.reject(e);
        }
    }
}