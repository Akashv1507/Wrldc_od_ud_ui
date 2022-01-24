import {odUdRespObj} from "./OdUdUiPage/odUdUiIndex"

export interface MaxMin {
    max: {'timestamp':string; 'value':number};
    min: {'timestamp':string; 'value':number};
    }

export interface OdUdPlotData {
    schDrawal:[string|any, number][]
    actDrawal: [string|any, number][]
    ui:[string|any, number][]
    shortage:[string|any, number][]
    consumption:[string|any, number][]
    availability:[string|any, number][]
    requirement:  [string|any, number][] 
 }

export const getDifference = (list1:[string,number][], list2:[string,number][]):[string,number][]=>{
   let diffList :[string,number][] =[]
   let intermediateRes:[string,number]
    list1.forEach((list1Ele, ind )=> {
        intermediateRes = [list1Ele[0], list1Ele[1]-list2[ind][1]]
        diffList.push(intermediateRes)     
    });
    return diffList
}

export const calMaxMin = (list :[string, number][],  roundNeeded:boolean= true): MaxMin=>{
        let maxminObj:MaxMin= {max: {timestamp:list[0][0], value:list[0][1]}, min :{timestamp:list[0][0], value:list[0][1]}}
        list.forEach((ele, ind)=>{
        if(ele[1]>maxminObj.max.value){
        maxminObj.max.value = ele[1]
        maxminObj.max.timestamp=ele[0]
        }
        if(ele[1]<maxminObj.min.value){
            maxminObj.min.value = ele[1]
            maxminObj.min.timestamp = ele[0]
            }
        })
        if(roundNeeded){
            //rounding to one decimal places
            maxminObj.min.value = Math.round(maxminObj.min.value )
            maxminObj.max.value = Math.round(maxminObj.max.value )
            return maxminObj
        }
        else{
            maxminObj.min.value = +maxminObj.min.value.toFixed(2)
            maxminObj.max.value = +maxminObj.max.value.toFixed(2)
            return maxminObj
        }
        
        
}

export const getValueCorresTime=(list :[string, number][], timestamp:string, roundNeeded:boolean= true):number=>{
    let value:number
    list.every((ele, ind)=>{
        if(ele[0]===timestamp){
            value = ele[1]
            return false
        }
       return true
    })
    if(roundNeeded){
        return Math.round(value)
    }
    else{
        return +value.toFixed(2)
    }
    
}

export function roundToOne(num: number) {
    return Math.round(num * 10) / 10
}

export const generateOdUdPlotData = (eleList:odUdRespObj):OdUdPlotData=>{
    let odUdPlotData:OdUdPlotData ={schDrawal:[], actDrawal:[], ui:[], shortage:[], consumption:[], availability:[], requirement:[]}

    eleList.odUdData.forEach((element ,ind)=> {
        odUdPlotData.schDrawal.push([element[0], element[1]])
        odUdPlotData.actDrawal.push([element[0], element[2]])
        odUdPlotData.ui.push([element[0], element[3]])
        odUdPlotData.shortage.push([element[0], element[4]])
        odUdPlotData.consumption.push([element[0], element[5]])
        odUdPlotData.availability.push([element[0], element[6]])
        odUdPlotData.requirement.push([element[0], element[7]])
    });
    return odUdPlotData
}

export const getAvgOdUDData= (actDrawal:[string,number][], schDrawal:[string,number][])=>{
    let sumOd= 0
    let sumUd= 0
    let countOd =0
    let countUd = 0
    let sumActCorrOd = 0
    let sumActCorrUd = 0
    let sumSchCorrOd = 0
    let sumSchCorrUd = 0
    // countUdInMin and countOdInMIn will count time in minutes od and ud greater than 250
    let countUdInMin = 0
    let countOdInMin = 0

    actDrawal.forEach((actDrawalEle, ind)=>{
        let ui = actDrawalEle[1]-schDrawal[ind][1]
        if (ui<0){
            countUd = countUd+1
            sumUd = sumUd+ui
            sumActCorrUd = sumActCorrUd+ actDrawalEle[1]
            sumSchCorrUd = sumSchCorrUd+ schDrawal[ind][1]
            if (ui<-250){
                countUdInMin= countUdInMin +1
            }
        }
        else if(ui>0){
            countOd = countOd+1
            sumOd = sumOd+ui
            sumActCorrOd = sumActCorrOd+ actDrawalEle[1]
            sumSchCorrOd = sumSchCorrOd+ schDrawal[ind][1]
            if (ui>250){
                countOdInMin= countOdInMin +1
            }
        }
    })

    let avgOdUdData = {'avgOd':Math.round(sumOd/countOd), 'avgActCorrOd':Math.round(sumActCorrOd/countOd), 
    'avgSchCorrOd': Math.round(sumSchCorrOd/countOd), 'avgUd': Math.round(sumUd/countUd), 
    'avgActCorrUd':Math.round(sumActCorrUd/countUd), 'avgSchCorrUd': Math.round(sumSchCorrUd/countUd) ,
    'countOdInMin': countOdInMin, '%countOdInMin':((countOdInMin/actDrawal.length)*100).toFixed(1), 'countUdInMin': countUdInMin, '%countUdInMin':((countUdInMin/actDrawal.length)*100).toFixed(1), '%totalUiInMin': (((countUdInMin+countUdInMin)/actDrawal.length)*100).toFixed(1)}
    return avgOdUdData
}

export const getNetUiActSch = (actDrawal:[string,number][], schDrawal:[string,number][])=>{
let netUiActSchObj = {'netUi':0, 'netAct':0, 'netSch':0 }
let sumAct =0
let sumSch = 0
const lenAct = actDrawal.length
const lenSch = schDrawal.length
actDrawal.forEach((actEle, ind)=>{
    sumAct = sumAct+actEle[1]
    sumSch = sumSch + schDrawal[ind][1]

})
netUiActSchObj.netAct = Math.round(sumAct/lenAct)
netUiActSchObj.netSch = Math.round(sumSch/lenSch)
netUiActSchObj.netUi =Math.round( (sumAct-sumSch)/lenSch)

return netUiActSchObj
}

export const getUiPosNeg = (schDrawal:[string, number][], uiData:[string, number][])=>{
    let actualCorrToUiPos:[string, number][] = []
    let actualCorrToUiNeg:[string, number][] = []
    let copySchDrawalData =JSON.parse(JSON.stringify(schDrawal));
    let uiPosNegData= {'actualCorrToUiPos':actualCorrToUiPos, 'actualCorrToUiNeg':actualCorrToUiNeg}

    uiData.forEach((ele, ind)=>{
        if(ele[1]>0){
            copySchDrawalData[ind][1] = copySchDrawalData[ind][1]+ele[1]
            
            actualCorrToUiPos.push(copySchDrawalData[ind])
        }
        else{
            copySchDrawalData[ind][1] = copySchDrawalData[ind][1]+ele[1]
            actualCorrToUiNeg.push(copySchDrawalData[ind])
        }
    })
    console.log(uiPosNegData)
    return uiPosNegData
}

export const getFreqStats= (actDrawal:[string,number][], schDrawal:[string,number][], freqData:[string,number][] )=>{
    
    let countOd =0
    let countUd = 0
    let countLessThanBandForOd = 0
    let countGreaterThanBandForUd = 0
    let countBetweenBand = 0
    

    actDrawal.forEach((actDrawalEle, ind)=>{
        let ui = actDrawalEle[1]-schDrawal[ind][1]
        if (ui<0 ){
            countUd = countUd+1
            if (freqData[ind][1]>50.05){
                countGreaterThanBandForUd = countGreaterThanBandForUd +1
            }
        }
        else if(ui>0){
            countOd = countOd+1
            if (freqData[ind][1]<49.90){
                countLessThanBandForOd = countLessThanBandForOd +1
            }  
        }
    })

    actDrawal.forEach((actDrawalEle, ind)=>{
        if (freqData[ind][1]>=49.90 && freqData[ind][1]<=50.05){
            countBetweenBand = countBetweenBand +1
        }  
    })

    let freqStatsData = {'countLessThanBandForOd':((countLessThanBandForOd/countOd)*100).toFixed(1), 'countGreaterThanBandForUd':((countGreaterThanBandForUd/countUd)*100).toFixed(1), 'countBetweenBand':((countBetweenBand/actDrawal.length)*100).toFixed(1),}
    return freqStatsData
}