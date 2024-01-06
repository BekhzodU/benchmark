import * as types from "../interface/dataTypes"

//"Your custom" code must be last
export const testNames : string[] =[
    'Object initialization',
    'Array initialization',
    'For loops',
    'Your custom code'
];

export const objects: types.CliData[] = [
    {uid: 10, code: '{}', isSpecific:true},
    {uid: 11, code: 'Object.create({})', isSpecific:true},
    {uid: 12, code: 'Object.fromEntries([])',isSpecific:true},
    {uid: 13, code: 'Object.assign({}, {})', isSpecific:true},
    {uid: 14, code: 'Object.create(null)', isSpecific:true},
    {uid: 15, code: 'new (function() {})()', isSpecific:true},
    {uid: 16, code: 'new (class {constructor() {}})()',isSpecific:true},
];

export const arrays: types.CliData[] = [
    {uid: 20, code: '[]', isSpecific:true},
    {uid: 21, code: 'new Array()', isSpecific:true},
    {uid: 22, code: 'Array.from([])',isSpecific:true},
    {uid: 23, code: 'Array.of()', isSpecific:true},
];

export const forLoops: types.CliData[] = [
    {uid: 30, code: 'for(const i in new Array(iteration).fill(0)){}', isSpecific:false},
    {uid: 31, code: 'for(const i of new Array(iteration).fill(0)){}', isSpecific:false},
    {uid: 32, code: 'for(let i=0; i<iteration+1; i++){}',isSpecific:false}
];
