/// <reference lib="webworker" />

import { CallData } from "./web-worker-ex";
import * as LZString from 'lz-string';

addEventListener('message', ({ data }) => {
    let callData = data as CallData;
    // const response = `worker response to ${data}`;
    let result = LZString.compressToUTF16(callData.data)
    postMessage({key: callData.key, data: result});
});
