import { odUdRespObj } from "./OdUdUiPage/odUdUiIndex";
import {schActDrawlResObj} from "./schVsActDrawlPage/schVsActDrawl"
import {IRespFreqAndCorrDev} from "./schVsActDrawlPage/fetchWrTotalData"

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
