import * as readline from "readline";

export default class CliInitializer{
    protected minIter:number;
    protected maxIter:number;
    protected rl: readline.Interface;
    
    constructor(minIter:number, maxIter:number) {
        this.rl = this.createReadline();
        this.readlineOnClose();
        this.minIter = minIter;
        this.maxIter = maxIter;
    }
    createReadline() :readline.Interface{
        return readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    readlineOnClose(): void{
        this.rl.on('close', ():void => {
            console.log('\nGoodbye!');
            process.exit(0);
        });
    }

    protected readlineQuestion (query:string): Promise<string>{
        return new Promise((resolve):void => {
            this.rl.question(query, (input:string):void => {
                resolve(input);
            });
        });
    }

}