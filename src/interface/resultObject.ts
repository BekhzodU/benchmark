export default interface ResultObject{
    time:number, //ms
    cpu: number, //Hz
    ram: number, //KB
    timeMin:number, //ms
    timeMax:number, // ms
    timeAvg:number, //ms
    iteration: number,
    uid: string,
    testName: string,
    timeDeviation?: number,
    cpuDeviation?:number,
    ramDeviation?:number

    [key: string]: any
}