import * as path from "path";
import * as fs from "fs";
import CLiMain from "./cli/cli";
import { currentDir } from "./test";
import ResultProcess from "./utils/resultProcess";

const testScriptPath: string = path.join(currentDir, "test.js");
const testScriptOriginalContent: string = fs.readFileSync(testScriptPath,"utf-8");
const resultProcess: ResultProcess = new ResultProcess(currentDir,testScriptOriginalContent);

const cli: CLiMain = new CLiMain(100000, 2000000, resultProcess);
cli.promptInit();
