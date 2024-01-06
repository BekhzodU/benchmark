import ResultObject from "../interface/resultObject";
import {tableFormat} from "../constants/tableFormat";

export const createTable = (finalResult: ResultObject[]):any[] => {
    return finalResult.map((obj:ResultObject) => {
        let newObj: Record<string, any> = {};
        for (const key in obj) {
            if(tableFormat[key]){
                newObj[tableFormat[key]] = obj[key];
            }
        }
        return newObj;
    });
}




