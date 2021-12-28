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

export const calMaxMin = (list :[string, number][]): MaxMin=>{
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

        //rounding to one decimal places
        maxminObj.min.value = roundToOne(maxminObj.min.value )
        maxminObj.max.value = roundToOne(maxminObj.max.value )
        return maxminObj
}

export const getValueCorresTime=(list :[string, number][], timestamp:string):number=>{
    let value:number
    list.every((ele, ind)=>{
        if(ele[0]===timestamp){
            value = ele[1]
            return false
        }
       return true
    })
    return roundToOne(value)
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

    actDrawal.forEach((actDrawalEle, ind)=>{
        let ui = actDrawalEle[1]-schDrawal[ind][1]
        if (ui<0){
            countUd = countUd+1
            sumUd = sumUd+ui
            sumActCorrUd = sumActCorrUd+ actDrawalEle[1]
            sumSchCorrUd = sumSchCorrUd+ schDrawal[ind][1]
        }
        else if(ui>0){
            countOd = countOd+1
            sumOd = sumOd+ui
            sumActCorrOd = sumActCorrOd+ actDrawalEle[1]
            sumSchCorrOd = sumSchCorrOd+ schDrawal[ind][1]
        }
    })

    let avgOdUdData = {'avgOd':roundToOne(sumOd/countOd), 'avgActCorrOd':roundToOne(sumActCorrOd/countOd), 'avgSchCorrOd': roundToOne(sumSchCorrOd/countOd), 'avgUd': roundToOne(sumUd/countUd), 'avgActCorrUd':roundToOne(sumActCorrUd/countUd), 'avgSchCorrUd': roundToOne(sumSchCorrUd/countUd) }
    return avgOdUdData
}