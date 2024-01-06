import * as path from "path"
import * as fsPromise from "fs/promises"
import * as childProcess from "child_process";
import ResultObject from "../interface/resultObject";
import * as types from "../interface/dataTypes"

export default class ResultProcessCreator{
    private testDir: string;
    private testScriptOriginalContent:string;
    constructor(testDir: string, testScriptOriginalContent:string) {
        this.testDir = testDir;
        this.testScriptOriginalContent = testScriptOriginalContent;
    }

    public async getFormattedTestFilePath (dataObj: types.CliData):Promise<string> {
        let newContent: string = this.testScriptOriginalContent
            .replace(/'\$\$UID\$\$'/g, dataObj?.uid.toString())
            .replace(/'\$\$ITERATION\$\$'/g, (dataObj?.iteration ?? 0).toString())
            .replace(/'\$\$SPECIFIC\$\$'/g, dataObj?.isSpecific.toString())
            .replace(/'\$\$CODE\$\$'/g, dataObj?.code )

        if(!dataObj?.isCustom){
            newContent = newContent.replace(/\$\$TESTNAME\$\$/g, dataObj?.code.substring(0, 50));
        }else{
            newContent = newContent.replace(/\$\$TESTNAME\$\$/g, 'Custom code');
        }

        const tempScriptPath: string = path.join(this.testDir, `test_${dataObj?.uid}.js`);
        await fsPromise.writeFile(tempScriptPath, newContent);
        return tempScriptPath;
    }

     public createAndSpawnChildProcess (dataObj: types.CliData): Promise<ResultObject> {
        return new Promise(async (resolve, reject):Promise<void> => {
            try {
                const tempScriptPath: string = await this.getFormattedTestFilePath(dataObj);
                const child: childProcess.ChildProcess = childProcess.fork(tempScriptPath);

                child.on('message', (message: ResultObject | types.ChildProcessError): void => {
                    if ('error' in message) {
                        // Handle ChildProcessError
                        reject(new Error(message.error));
                        child.kill();
                    } else {
                        // Handle ResultObject
                        resolve(message);
                        child.kill();
                    }
                });
                child.on('exit', ():void => {
                    fsPromise.unlink(tempScriptPath).catch((error): void => {
                        reject(error);
                    });
                });
                child.on('error',(err: Error):void => {
                    console.log('here');
                    reject(err)
                });
                child.send('runCheckResult');

            } catch (error) {
                reject(error);
            }
        });
    }
}
