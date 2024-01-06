import ResultObject from "../interface/resultObject";
import * as constants from '../constants/constants';
import {createTable} from "../utils/createTable";
import CliInitializer from "./cliInitializer";
import ResultProcess from "../utils/resultProcess";
import * as types from "../interface/dataTypes"

let formattedTestNames:string = constants.testNames.map((name:string, index:number):string => `${index + 1}) ${name}`).join('\n');
formattedTestNames = `\n${formattedTestNames}\n`;
const testNamesLength:number = constants.testNames.length;

export default class CLiMain extends CliInitializer{
     public processClass :ResultProcess;

    constructor(minIter:number, maxIter:number, processClass :ResultProcess) {
        super(minIter, maxIter);
        this.processClass = processClass;
    }

    public promptInit ():void  {
        console.log('Welcome to Benchmark! My name is Bekhzod. I will be your guide here 😊');
        setTimeout(() => this.promptForNumber(), 2000);
    }

    public async promptForNumber ():Promise<void> {
        const optionsInput:string = await this.readlineQuestion(`\nHere are the options to test: ${formattedTestNames}\n To exit please type 0 \n\nPlease enter an option you chose: `);
        const number:number = parseFloat(optionsInput);
        const options: number[] = Array.from({ length:testNamesLength }, (_, index) => index + 1)
        if( optionsInput === '0'){
            this.rl.close();
            return;
        }
        if (!isNaN(number)) {
            if(options.includes(number)){
                await this.promptForUserInputs(number);
                return;
            }
            console.log('\nEntered wrong number. Please choose correctly from the options');
            await this.promptForNumber();
            return;
        }
        console.log('\nEntered value is not a number. Please try again.');
        await this.promptForNumber();
    }

    public async promptForUserInputs (chosenNumber: number):Promise<void> {
        const chosenObjects:types.CliData[] = this.getObjectsByNumber(chosenNumber);
        if(chosenNumber !== testNamesLength){
            await this.createSpecificTestCase(chosenNumber, chosenObjects);
            return;
        }
        const customCodeInput:string = await this.readlineQuestion('\nPlease enter your custom JS code.\n Enter Here:  ');
        try{
            const customObject:types.CliData[] = chosenObjects.map(obj => {
                return {...obj, code: customCodeInput.trim()}
            });
            await this.getProcessedObjects(chosenNumber, customObject);
        }catch (err){
            console.log('\nThere is something wrong here. Please enter correct custom code');
            await this.promptForUserInputs(chosenNumber);
        }
    }

    public async createSpecificTestCase (chosenNumber: number, chosenObjects:types.CliData[]):Promise<void> {
        const codeString:string = chosenObjects.map((obj:types.CliData, index:number):string => `${index + 1}) ${obj.code}`).join('\n');
        const iterationsInput:string = await this.readlineQuestion(`\nThere are ${chosenObjects.length} test cases. Please enter the number of iterations for each test case separated by whiteSpace.\nIterations should be between >=${this.minIter} and <=${this.maxIter} !! \n\n${codeString} \n Enter Here:  `);
        const resultArray:string[] = iterationsInput.split(" ").filter(item => item !== "");
        try{
            if (
                resultArray.length === chosenObjects.length &&
                resultArray.every(num => !isNaN(parseFloat(num)) && parseFloat(num) >= this.minIter && parseFloat(num) <= this.maxIter)
            ){
                await this.getProcessedObjects(chosenNumber, chosenObjects, resultArray.map(num => parseFloat(num)));
            }else{
                throw new Error('Wrong numbers. Please enter correctly');
            }
        }catch (err : any){
            console.log(`\n${err.message}. Please try again.`);
            await this.promptForUserInputs(chosenNumber);
        }
    }

    public async getProcessedObjects (chosenNumber:number, chosenObjects:types.CliData[], iterationsArray?: number[]):Promise<void>{
        let finalObjects: types.CliData[] = chosenObjects;
        if(iterationsArray){
            finalObjects = chosenObjects.map((obj:types.CliData, index:number):types.CliData => {
                return { ...obj, iteration: iterationsArray?.[index] };
            });
        }
        try{
            console.log('Please wait. Loading...');
            const finalResult:ResultObject[] = await this.processClass.getAllProcessData(finalObjects);
            const formattedResult:any[] = createTable(finalResult);
            console.table(formattedResult);
            await this.afterFinalResultPrompt(chosenNumber);
        }catch(err ){
            throw new Error('Inserted custom code is wrong.');
        }
    }

    public async afterFinalResultPrompt (chosenNumber:number):Promise<void> {
        const finalInput:string = await this.readlineQuestion(`\nPlease choose (Enter 0 or 1 or 2): \n0) Exit \n1) Try this Test case again \n2) Go to main menu \nEnter Here: `);
        if(finalInput === '1'){
            await this.promptForUserInputs(chosenNumber);
            return;
        }
        if(finalInput === '2'){
            await this.promptForNumber();
            return;
        }
        if(finalInput === '0'){
            this.rl.close();
            return;
        }
        console.log('\nPlease enter correct number');
        await this.afterFinalResultPrompt(chosenNumber);
    }

    private getObjectsByNumber (chosenNumber: number):types.CliData[] {
        if(chosenNumber === 1){
            return constants.objects;
        }
        if(chosenNumber === 2){
            return constants.arrays;
        }
        if(chosenNumber === 3){
            return constants.forLoops;
        }
        return [{uid: 50, code: '',isSpecific:false, iteration: 0, isCustom: true}];
    }
}


