import * as perf_hooks from "perf_hooks";
import * as processMeasure from "process";
import * as path from "path";
import * as types from "./interface/dataTypes"
import ResultObject from "./interface/resultObject"
import {getFormatted} from "./utils/formatData"

export const currentDir: string = path.dirname(__filename);

const iteration:number = Number('$$ITERATION$$');
const isSpecific:boolean = Boolean('$$SPECIFIC$$');
const checkResult = (): ResultObject => {
    if(isSpecific){
        return {testName: '$$TESTNAME$$', uid: '$$UID$$', iteration, ...checkMemory(), ...checkTime()}
    }
    return {testName: '$$TESTNAME$$', uid: '$$UID$$', iteration, ...checkMemoryGeneral(), ...checkTimeGeneral()}
}

const checkTime = (): types.TimeTestResult=> {
    let timeMin: number= -1;
    let timeMax:number = -1;
    let timeAvg:number = 0;
    let time:number = 0;

    for(let i:number = 0; i<iteration; i++){
        perf_hooks.performance.mark('start');
        '$$CODE$$'
        perf_hooks.performance.mark('end');
        let result: number =  perf_hooks.performance.measure('time', 'start', 'end').duration;
        if(timeMin === -1){
            timeMin = result;
        }
        if(timeMax === -1){
            timeMax = result;
        }
        timeMin = (timeMin >= result) ? result : timeMin;
        timeMax = (timeMax <= result) ? result : timeMax;
        timeAvg += result/iteration;
        time += result;
        perf_hooks.performance.clearMarks('start');
        perf_hooks.performance.clearMarks('end');
        perf_hooks.performance.clearMeasures('time')
    }
    timeMin = getFormatted(timeMin, true);
    timeMax = getFormatted(timeMax, true);
    timeAvg = getFormatted(timeAvg, true);
    time = getFormatted(time, true)
    return {timeMin, timeMax, timeAvg, time};
}

const checkMemory =(): types.MemoryTestResult => {
    const cpuStart:number = processMeasure.cpuUsage().user;
    const memoryBefore:NodeJS.MemoryUsage = processMeasure.memoryUsage();
    for(let i:number = 0; i < iteration; i++) {
        '$$CODE$$'
    }
    //@ts-ignore
    const memoryAfter:NodeJS.MemoryUsage = processMeasure.memoryUsage(memoryBefore);
    const cpuEnd:number = processMeasure.cpuUsage().user;
    return returnMemoryObject(memoryAfter.heapUsed, cpuEnd, cpuStart);
}

const checkTimeGeneral = (): types.TimeTestResult=> {
    perf_hooks.performance.mark('start');
    '$$CODE$$'
    perf_hooks.performance.mark('end');
    let result: number =  perf_hooks.performance.measure('time', 'start', 'end').duration;
    perf_hooks.performance.clearMarks('start');
    perf_hooks.performance.clearMarks('end');
    perf_hooks.performance.clearMeasures('time')
    result = getFormatted(result, true);
    return {timeMin: result, timeMax:result, timeAvg: result, time:result};
}

const checkMemoryGeneral =(): types.MemoryTestResult => {
    const cpuStart:number = processMeasure.cpuUsage().user;
    const memoryBefore:NodeJS.MemoryUsage = processMeasure.memoryUsage();
    '$$CODE$$'
    //@ts-ignore
    const memoryAfter:NodeJS.MemoryUsage = processMeasure.memoryUsage(memoryBefore);
    const cpuEnd:number = processMeasure.cpuUsage().user;
    return returnMemoryObject(memoryAfter.heapUsed, cpuEnd, cpuStart);
}

const returnMemoryObject = (heapUsed:number, cpuEnd:number, cpuStart:number): types.MemoryTestResult => {
    const ram:number = getFormatted((heapUsed) / 1024, true);
    const cpu:number = getFormatted(iteration / (cpuEnd - cpuStart), false);
    return { ram, cpu };
}

process.on('message', (message):void => {
    if (message === 'runCheckResult' && process.send) {
        process.send(checkResult());
    }
});

// For uncaught exceptions
process.on('uncaughtException', (err:Error):void => {
    if(process.send){
        process.send({error: err.message});
    }
});