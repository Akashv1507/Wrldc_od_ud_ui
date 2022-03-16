import {getReportHtmlContent, getStateReData, getIstsReData, getFreqProfileData, getGenPlotData} from "../fetchDataApi"
import { StateRePlotData, StateRePlotTrace, setPlotTraces } from "./stateRePlotUtils";
import {ParProfPlotData, ParProfPlotTrace, setPlotTraces as parSetPlotTrace } from "./parProfPlotUtils"
import { yyyymmddtoDateObj } from "../timeUtils";

export interface ISingleStateReData{
  dateKey: string;
  val: number;
  showDateKey:string
} 
export interface IProfileObj{
  dateKey: string;
  value: number;
  parName:string
} 
//interface for object with dynamic keys Ref- https://stackoverflow.com/questions/39256682/how-to-define-an-interface-for-objects-with-dynamic-keys
export interface IProfileResp{
  [dateId: string]: IProfileObj[];
} 

export interface IStateReData{
  consumption: ISingleStateReData[];
  maxDem: ISingleStateReData[];
  solar:ISingleStateReData[];
  wind:ISingleStateReData[];
  entity: string;

} 
export interface IIstsReData{
  solarGen:ISingleStateReData[],
  windGen : ISingleStateReData[]
}

export const fetchReportHtml = async()=>{
   
    //to display error msg
    const errorDiv = document.getElementById("errorContDevTableDiv") as HTMLDivElement;
  
    //to display spinner
    const spinnerDiv = document.getElementById("contDeviationTableSpinner") as HTMLDivElement;
  
    const reportSectionDiv = document.getElementById("reportSection") as HTMLDivElement;
  
    //get user inputs
    let targetDateValue = (
      document.getElementById("targetDate") as HTMLInputElement
    ).value;

    const htmlText = await getReportHtmlContent(targetDateValue)
    reportSectionDiv.innerHTML = htmlText

    const stateReResp = await getStateReData(targetDateValue)
    const stateReData = stateReResp.stateReData
    
    // plotting state RE data
    for (let stateInd = 0; stateInd < stateReData.length; stateInd++) {

      let StateMaxDemPlotData: StateRePlotData = {
        title: 'Maximum Demand Met(MW)',
        traces: [],
        yAxisTitle: "Demand(MW)",
        // barmode: "relative"
      };

      let StateConsumpPlotData: StateRePlotData = {
        title: 'Consumption(MU)',
        traces: [],
        yAxisTitle: "Consumption(MU)",
        // barmode: "relative"
      };

      let StateWindGenPlotData: StateRePlotData = {
        title: 'Wind Generation(MU)',
        traces: [],
        yAxisTitle: "Wind Gen(MU)",
        // barmode: "relative"
      };

      let StateSolarGenPlotData: StateRePlotData = {
        title: 'Solar Generation(MU)',
        traces: [],
        yAxisTitle: "Solar Gen(Mu)",
        // barmode: "relative"
      };
  
      let stateMaxDemTrace: StateRePlotTrace = {
        name: `${stateReData[stateInd].entity}`,
        data: stateReData[stateInd].maxDem,
        type: "bar",
        hoverYaxisDisplay: "MW",
        marker_color:'#FF7F50'
        
      };
      StateMaxDemPlotData.traces.push(stateMaxDemTrace);

      let stateConsumpTrace: StateRePlotTrace = {
        name: `${stateReData[stateInd].entity}`,
        data: stateReData[stateInd].consumption,
        type: "bar",
        hoverYaxisDisplay: "MU",
        marker_color:'#189AB4'
      };
      StateConsumpPlotData.traces.push(stateConsumpTrace);

      let stateWindGenTrace: StateRePlotTrace = {
        name: `${stateReData[stateInd].entity} Wind`,
        data: stateReData[stateInd].wind,
        type: "bar",
        hoverYaxisDisplay: "MU",
        marker_color:'#2E8B57'
      };
      StateWindGenPlotData.traces.push(stateWindGenTrace);

      let stateSolarGenTrace: StateRePlotTrace = {
        name: `${stateReData[stateInd].entity} Solar`,
        data: stateReData[stateInd].solar,
        type: "bar",
        hoverYaxisDisplay: "MU",
        marker_color:'#EF7C8E'
      };
      StateSolarGenPlotData.traces.push(stateSolarGenTrace);

      setPlotTraces(`${stateReData[stateInd].entity}_maxDem`, StateMaxDemPlotData); 
      setPlotTraces(`${stateReData[stateInd].entity}_consump`, StateConsumpPlotData); 
      setPlotTraces(`${stateReData[stateInd].entity}_windGen`, StateWindGenPlotData); 
      setPlotTraces(`${stateReData[stateInd].entity}_solarGen`, StateSolarGenPlotData);  

    }

    // plotting ISTS RE data
    const istsReData = await getIstsReData(targetDateValue)
    let IstsWindGenPlotData: StateRePlotData = {
      title: 'Wind Generation',
      traces: [],
      yAxisTitle: "Wind Gen(MU)",
    };

    let IstsSolarGenPlotData: StateRePlotData = {
      title: 'Solar Generation',
      traces: [],
      yAxisTitle: "Solar Gen(MU)",
    };

    let istsWindGenTrace: StateRePlotTrace = {
      name: `ISTS Wind`,
      data:istsReData.windGen ,
      type: "bar",
      hoverYaxisDisplay: "MU",
      marker_color:'#FF7F50'
    };
    IstsWindGenPlotData.traces.push(istsWindGenTrace);

    let istsSolarGenTrace: StateRePlotTrace = {
      name: `ISTS Solar`,
      data:istsReData.solarGen ,
      type: "bar",
      hoverYaxisDisplay: "MU",
      marker_color:'#189AB4'
    };
    IstsSolarGenPlotData.traces.push(istsSolarGenTrace);

    setPlotTraces(`ists_windGen`, IstsWindGenPlotData); 
    setPlotTraces(`ists_solarGen`, IstsSolarGenPlotData);

    // plotting frequency profile data
    const freqProfData = await getFreqProfileData(targetDateValue)
    let ParProfPlotData: ParProfPlotData = {
      title: 'Frequency Profile',
      traces: [],
      yAxisTitle: "%age Time",
      barmode:"group"
    };
    // get all values for corresponding keys
    const freqProfDataVal:IProfileObj[][] = Object.values(freqProfData)

    for(let dateKeyInd = 0; dateKeyInd < freqProfDataVal.length; dateKeyInd++){
 
      let freqProfPlotRace: ParProfPlotTrace = {
        name: yyyymmddtoDateObj(freqProfDataVal[dateKeyInd][0].dateKey),
        data:freqProfDataVal[dateKeyInd],
        type: "bar",
        hoverYaxisDisplay: "%age",
      };
      ParProfPlotData.traces.push(freqProfPlotRace);
    }
    parSetPlotTrace(`freqProf`, ParProfPlotData); 

    // plotting Generation profile data
    const genProfData = await getGenPlotData(targetDateValue)
    let GenProfPlotData: ParProfPlotData = {
      title: 'Generation Profile(MU)',
      traces: [],
      yAxisTitle: "Gen(MU)",
      barmode:"group"
    };
    // get all values for corresponding keys
    const genProfDataVal:IProfileObj[][] = Object.values(genProfData)

    for(let dateKeyInd = 0; dateKeyInd < genProfDataVal.length; dateKeyInd++){
 
      let genProfPlotRace: ParProfPlotTrace = {
        name: `${genProfDataVal[dateKeyInd][0].dateKey}`,
        data:genProfDataVal[dateKeyInd],
        type: "bar",
        hoverYaxisDisplay: "MU",
      };
      GenProfPlotData.traces.push(genProfPlotRace);
    }
    parSetPlotTrace(`genProf`, GenProfPlotData); 
}