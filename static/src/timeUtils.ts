import moment from 'moment';

export interface IStartEndTime{
    startTime: string
    endTime:string
}

export const toDateObj = (timestampStr: string): Date => {
    // convert 2021_09_15_04_15_00 to javascript dateobject
    let year = Number(timestampStr.substring(0, 4));
    let month = Number(timestampStr.substring(5, 7));
    let day = Number(timestampStr.substring(8, 10));
    let hour = Number(timestampStr.substring(11, 13));
    let minute = Number(timestampStr.substring(14, 16));
    let second = Number(timestampStr.substring(17, 19));
    let newTimestamp = new Date(year, month - 1, day, hour, minute, second);
    return newTimestamp;
};

export const convertDateTimeToStr = (inp: Date): string => {
    return `${ensureTwoDigits(inp.getDate())}-${ensureTwoDigits(inp.getMonth() + 1)}-${inp.getFullYear()}`;
}

export const ensureTwoDigits = (num: number): string => {
    if (num < 10) {
        return "0" + num;
    }
    return "" + num;
}
// convert '2022-01-24T00:00' to '2022-01-24 00:00:00'
export const convertIsoString = (timestamp:string):string => {
let datePart = timestamp.substring(0,10)
let timepartHHMM= timestamp.substring(11,16)+':00'
let newCombineTimestamp = datePart + ' '+ timepartHHMM
return newCombineTimestamp
}
export const yyyyddmmToddmmyyy = (timestamp:string):string => {
    return moment(timestamp).format("DD-MM-YYYY")
    }

export const getListOfDates = (startTime:string, endTime:string): IStartEndTime[]=>{
    
    let startTimeObj = moment(startTime)
    let endTimeObj = moment(endTime)
    let currStartTimeObj = startTimeObj.clone()
    let currEndTimeObj = endTimeObj.clone()
    let timeChunksList:IStartEndTime[] = []
    
    // creating chunks of date between start time and end time
    while (currStartTimeObj<endTimeObj){
        // checking for if curr date is same as end date.(happens in case of last iteration and if start and end date are same)
        if (currStartTimeObj.isSame(endTimeObj,'date')){
            timeChunksList.push({startTime:currStartTimeObj.format("YYYY-MM-DD HH:mm:ss"), endTime:endTimeObj.format("YYYY-MM-DD HH:mm:ss")})
        }
        else{
            let cloneCurrStartTimeObj = currStartTimeObj.clone()
            currEndTimeObj = cloneCurrStartTimeObj.set({h: 23, m: 59, s:0})
            timeChunksList.push({startTime:currStartTimeObj.format("YYYY-MM-DD HH:mm:ss"), endTime:currEndTimeObj.format("YYYY-MM-DD HH:mm:ss")})
        }
        currStartTimeObj = currEndTimeObj.clone().add(1, 'minute')
        currEndTimeObj = currStartTimeObj.clone().set({h: 23, m: 59, s:0})
    }
    return timeChunksList
}

export const getMultiplyingFactorMus = (startTime:string, endTime:string):number=>{
    
    let startTimeObj = moment(startTime)
    let endTimeObj = moment(endTime)
    
    const totalMinutes = endTimeObj.diff(startTimeObj ,'minutes')
    const multiplyingFactorMus = (totalMinutes+1)/(60*1000)
    return multiplyingFactorMus
}