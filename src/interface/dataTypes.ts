export interface CliData{
    uid: number,
    code: string,
    isSpecific:boolean,
    iteration?: number
    isCustom?: boolean
}

export interface ChildProcessError{
    error: string
}

export interface TimeTestResult{
    timeMin: number,
    timeMax: number,
    timeAvg: number,
    time: number
}

export interface MemoryTestResult{
    ram: number,
    cpu: number
}



