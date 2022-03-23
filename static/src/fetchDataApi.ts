import { odUdRespObj } from "./OdUdUiPage/odUdUiIndex";
import {schActDrawlResObj} from "./schVsActDrawlPage/schVsActDrawl"
import {IRespFreqAndCorrDev} from "./schVsActDrawlPage/fetchWrTotalData"
import {IStateReData, IIstsReData, IProfileResp} from "./MorningReportPage/fetchReportHtml"

export interface Deviation{
  date:string
  fromTb:string
  toTb:string
  avgDeviation :number
  minDeviation:number
  maxDeviation:number
}

export interface ContDeviationResp{
  odListObj :Deviation[]
  udListObj: Deviation[]
}

export interface IStateReRespData{
  stateReData:IStateReData[]
}



export const getOdUdData = async (
  startDate: string,
  endDate: string,
  stateName: string
): Promise<odUdRespObj | null> => {
  try {
    const resp = await fetch(`/api/odUd/${startDate}/${endDate}/${stateName}`, {
      method: "get",
    });
    const respJSON = await resp.json();
    return respJSON;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getSchVsActDrawlData = async (
  startDate: string,
  endDate: string,
  scadaPointName: string
): Promise<schActDrawlResObj | null> => {
  try {
    const resp = await fetch(`/api/schVsActDrawl/${startDate}/${endDate}/${scadaPointName}`, {
      method: "get",
    });
  
    const respJSON = await resp.json();   
    return respJSON;   
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getContDeviationData = async (
  startDate: string,
  endDate: string,
  stateName: string
): Promise<ContDeviationResp | null> => {
  try {
    const resp = await fetch(`/api/contOdUd/${startDate}/${endDate}/${stateName}`, {
      method: "get",
    });

    const respJSON = await resp.json();
    return respJSON;    
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getFreqAndCorrDevData = async (
  startDate: string,
  endDate: string,
): Promise<IRespFreqAndCorrDev | null> => {
  try {
    const resp = await fetch(`/api/wrFreq_Dev/${startDate}/${endDate}`, {
      method: "get",
    });

    const respJSON = await resp.json();
    return respJSON;   
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getReportHtmlContent = async (
  targetDate: string,
)=>{
  try {
    const resp = await fetch(`/generteMorningReport/${targetDate}`, {
      method: "get",
    });

    const respHtml = await resp.text();
    return respHtml;  
  } catch (e) {
    console.error(e);
    return null;
  }  
}
export const getStateProfDrawlTblHtmlContent = async (
  targetDate: string,
)=>{
  try {
    const resp = await fetch(`/getStateDrawlTblData/${targetDate}`, {
      method: "get",
    });

    const respHtml = await resp.text();
    return respHtml;  
  } catch (e) {
    console.error(e);
    return null;
  }  
}

export const getStateReData = async (
  targetDate: string,
):Promise<IStateReRespData | null>=>{
  try {
    const resp = await fetch(`/getStateReData/${targetDate}`, {
      method: "get",
    });

    const respJson = await resp.json();
    return respJson;    
  } catch (e) {
    console.error(e);
    return null;
  } 
}

export const getIstsReData = async (
  targetDate: string,
):Promise<IIstsReData | null>=>{
  try {
    const resp = await fetch(`/getIstsReData/${targetDate}`, {
      method: "get",
    });

    const respJson = await resp.json();
    return respJson;    
  } catch (e) {
    console.error(e);
    return null;
  } 
}

export const getFreqProfileData = async (
  targetDate: string,
):Promise<IProfileResp | null>=>{
  try {
    const resp = await fetch(`/getFreqProfPlotData/${targetDate}`, {
      method: "get",
    });

    const respJson = await resp.json();
    return respJson;    
  } catch (e) {
    console.error(e);
    return null;
  } 
}

export const getGenPlotData = async (
  targetDate: string,
):Promise<IProfileResp | null>=>{
  try {
    const resp = await fetch(`/getGenPlotData/${targetDate}`, {
      method: "get",
    });

    const respJson = await resp.json();
    return respJson;    
  } catch (e) {
    console.error(e);
    return null;
  } 
}

export const getStateDrawlProfilePlotData = async (
  targetDate: string,
):Promise<IProfileResp | null>=>{
  try {
    const resp = await fetch(`/getStateDrawlPlotData/${targetDate}`, {
      method: "get",
    });

    const respJson = await resp.json();
    return respJson;    
  } catch (e) {
    console.error(e);
    return null;
  } 
}
