export const getFormatted = (num:number, isTime:boolean): number=> {
    return isTime ? Number(num.toFixed(8)) : Number(num.toFixed(3));
}

export const getDeviation = (avg:number, overall:number):number =>{
    let deviation:number = (avg - overall)*100/overall;
    if(isNaN(deviation)){
        deviation = 0;
    }
    return getFormatted(deviation, false);
}