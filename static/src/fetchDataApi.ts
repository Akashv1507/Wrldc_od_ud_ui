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

export interface IDamRtmPlotData{
  IEX_DAM:[string,number][]
  IEX_RTM:[string,number][]
  dateKey : string
}
export interface IRrasScedPlotData{
  rras:[string,number][]
  sced:[string,number][]
  dateKey : string
}
export interface IHourlyDemShortageObj{
  AMNSIL_dem: number,
  AMNSIL_short: number,
  CH_dem: number,
  CH_short: number,
  DD_dem: number,
  DD_short: number,
  DNH_dem: number,
  DNH_short: number,
  GOA_dem: number,
  GOA_short: number,
  GUJ_dem: number,
  GUJ_short: number,
  MAH_dem: number,
  MAH_short: number,
  MP_dem: number,
  MP_short: number,
  dateKey: string,
  hour: number
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

export const getHourlyDemShortTbldData = async (
  startDate: string,
  endDate: string,
): Promise<IHourlyDemShortageObj[] | null> => {
  try {
    const resp = await fetch(`/api/hourlyDemShortage/${startDate}/${endDate}`, {
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
export const getWbesData = async (
  startDate: string,
  endDate: string,
  acrName: string
): Promise<schActDrawlResObj | null> => {
  try {
    const resp = await fetch(`/api/wbesData/${startDate}/${endDate}/${acrName}`, {
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

export const getDamRtmPlotData = async (
  targetDate: string,
):Promise<IDamRtmPlotData[] | null>=>{
  try {
    const resp = await fetch(`/getDamRtmPlotData/${targetDate}`, {
      method: "get",
    });

    const respJson = await resp.json();
    return respJson;    
  } catch (e) {
    console.error(e);
    return null;
  } 
}

export const getRrasScedPlotData = async (
  targetDate: string,
):Promise<IRrasScedPlotData[] | null>=>{
  try {
    const resp = await fetch(`/getRrasScedPlotData/${targetDate}`, {
      method: "get",
    });

    const respJson = await resp.json();
    return respJson;    
  } catch (e) {
    console.error(e);
    return null;
  } 
}
