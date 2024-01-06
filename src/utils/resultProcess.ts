import ResultObject from '../interface/resultObject';
import {getDeviation} from "./formatData"
import ResultProcessCreator from "./resultProcessCreator";
import * as types from "../interface/dataTypes"

export default class ResultProcess extends ResultProcessCreator{
    constructor(testDir: string, testScriptOriginalContent:string) {
        super(testDir, testScriptOriginalContent);
    }

    public async getAllProcessData(array: types.CliData[]): Promise<ResultObject[]> {
        try{
            const promises: Promise<ResultObject>[] = [];
            for (let i: number = 0; i < array.length; i++) {
                promises.push(super.createAndSpawnChildProcess(array[i]));
            }
            const dataObjects:ResultObject[] = await Promise.all(promises);
            return await this.addDeviationData(dataObjects);
        }catch(err){
            throw err
        }
    }

    async addDeviationData (dataObjects: ResultObject[]):Promise<ResultObject[]> {
        let overallTimeAvg:number = 0;
        let overallCpuAvg:number = 0;
        let overallRamAvg:number = 0;
        dataObjects.forEach(obj => {
            overallTimeAvg += obj.timeAvg/dataObjects.length;
            overallCpuAvg += obj.cpu/dataObjects.length;
            overallRamAvg += obj.ram/dataObjects.length;
        })
        dataObjects = dataObjects.map(obj  => {
            return {...obj, cpuDeviation: getDeviation(obj.cpu, overallCpuAvg), ramDeviation: getDeviation(obj.ram, overallRamAvg), timeDeviation: getDeviation(obj.timeAvg, overallTimeAvg) }
        });
        return dataObjects;
    }
}




