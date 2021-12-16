import { odUdRespObj } from "./index";

export const getOdUdData = async (
  startDate: string,
  endDate: string,
  stateName: string
): Promise<[][] | null> => {
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
