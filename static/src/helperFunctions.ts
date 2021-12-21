import {odUdRespObj} from "./OdUdUiPage/odUdUiIndex"

export interface MaxMinAvg {
    max: number;
    min: number;
    avg : number;
    sum:number;
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

export const calMaxMinAvg = (list :[string, number][]): MaxMinAvg=>{
let maxminAvg:MaxMinAvg= {max: list[0][1], min :list[0][1], avg:0, sum:0}
list.forEach((ele, ind)=>{
if(ele[1]>maxminAvg.max){
maxminAvg.max = ele[1]
}
if(ele[1]<maxminAvg.min){
    maxminAvg.min = ele[1]
    }
maxminAvg.sum = maxminAvg.sum+ele[1]
})
maxminAvg.avg = maxminAvg.sum/list.length

//rounding to one decimal places
maxminAvg.avg = roundToOne(maxminAvg.avg )
maxminAvg.min = roundToOne(maxminAvg.min )
maxminAvg.max = roundToOne(maxminAvg.max )
return maxminAvg
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