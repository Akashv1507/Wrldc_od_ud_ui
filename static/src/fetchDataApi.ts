import { odUdRespObj } from "./OdUdUiPage/odUdUiIndex";
import {schActDrawlResObj} from "./schVsActDrawlPage/schVsActDrawl"

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
