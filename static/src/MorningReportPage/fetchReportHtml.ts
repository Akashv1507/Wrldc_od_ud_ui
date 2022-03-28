import {getReportHtmlContent, getStateReData, getIstsReData, getFreqProfileData, getGenPlotData, getStateProfDrawlTblHtmlContent, getStateDrawlProfilePlotData, getDamRtmPlotData, getRrasScedPlotData} from "../fetchDataApi"
import { StateRePlotData, StateRePlotTrace, setPlotTraces } from "./stateRePlotUtils";
import {ParProfPlotData, ParProfPlotTrace, setPlotTraces as parSetPlotTrace } from "./parProfPlotUtils"
import {PlotData, PlotTrace, setPlotTraces as timeSeriesSetPlotTraces} from "../plotUtils"
import { yyyymmddtoDateStr } from "../timeUtils";

export interface ISingleStateReData{
  dateKey: string;
  val: number;
  showDateKey:string
} 
export interface IProfileObj{
  legName: string;
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
    const stateDrawlMixTblDiv = document.getElementById("stateDrawlProfileTbl") as HTMLDivElement;
    const rtmDamPlotsDiv = document.getElementById("rtmDamPlots") as HTMLDivElement;
    const rrasScedPlotsDiv = document.getElementById("rrasScedPlots") as HTMLDivElement;
  
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
        name: yyyymmddtoDateStr(freqProfDataVal[dateKeyInd][0].legName),
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
        name: yyyymmddtoDateStr(genProfDataVal[dateKeyInd][0].legName),
        data:genProfDataVal[dateKeyInd],
        type: "bar",
        hoverYaxisDisplay: "MU",
      };
      GenProfPlotData.traces.push(genProfPlotRace);
    }
    parSetPlotTrace(`genProf`, GenProfPlotData); 


    //  table of state drawl profile mix
    const stateDrawlTblHtmlText = await getStateProfDrawlTblHtmlContent(targetDateValue)
    stateDrawlMixTblDiv.innerHTML = stateDrawlTblHtmlText

    // ploting  of state drawl profile mix
    const stateDrawlProfilePlotData = await getStateDrawlProfilePlotData(targetDateValue)
    let StateDrawlProfPlotData: ParProfPlotData = {
      title: 'State Drawl Profile Mix in %',
      traces: [],
      yAxisTitle: "Percentage %",
      barmode:"group"
    };
    // get all values for corresponding keys
    const stateDrawlProfilePlotDataVal:IProfileObj[][] = Object.values(stateDrawlProfilePlotData)

    for(let metricInd = 0; metricInd < stateDrawlProfilePlotDataVal.length; metricInd++){
 
      let stateDrawlProfPlotRace: ParProfPlotTrace = {
        name: stateDrawlProfilePlotDataVal[metricInd][0].legName,
        data:stateDrawlProfilePlotDataVal[metricInd],
        type: "bar",
        hoverYaxisDisplay: "%",
      };
      StateDrawlProfPlotData.traces.push(stateDrawlProfPlotRace);
    }
    parSetPlotTrace(`stateDrawlProfileTbl`, StateDrawlProfPlotData); 

    // ploting  of DAM RTM
    const damRtmResData = await getDamRtmPlotData(targetDateValue)

    for(let dateKeyInd = 0; dateKeyInd < damRtmResData.length; dateKeyInd++){
      let plotDiv = document.createElement("div"); 
      plotDiv.id = `damRtm_${dateKeyInd}_plot`;
      rtmDamPlotsDiv.appendChild(plotDiv);
      let DamRtmPlotData: PlotData = {
        title: 'DAM VS RTM',
        traces: [],
        yAxisTitle: "Rs/Unit",
        barmode:"group"
      };

      let DamPlotRace: PlotTrace = {
        name: `DAM_${damRtmResData[dateKeyInd].dateKey}`,
        data:damRtmResData[dateKeyInd].IEX_DAM,
        type: "bar",
        hoverYaxisDisplay: "Rs/Unit",
        // barWidth:
      };
      DamRtmPlotData.traces.push(DamPlotRace);

      let RtmPlotRace: PlotTrace = {
        name: `RTM_${damRtmResData[dateKeyInd].dateKey}`,
        data:damRtmResData[dateKeyInd].IEX_RTM,
        type: "bar",
        hoverYaxisDisplay: "Rs/Unit",
        // barWidth:5
      };
      DamRtmPlotData.traces.push(RtmPlotRace);
      timeSeriesSetPlotTraces(`damRtm_${dateKeyInd}_plot`, DamRtmPlotData);
    } 
    
    // ploting of RRAS SCED
    const rrasScedResData = await getRrasScedPlotData(targetDateValue)
    console.log(rrasScedResData)
    for(let dateKeyInd = 0; dateKeyInd < rrasScedResData.length; dateKeyInd++){
      console.log("hi")
      let plotDiv = document.createElement("div"); 
      plotDiv.id = `rrasCed_${dateKeyInd}_plot`;
      rrasScedPlotsDiv.appendChild(plotDiv);

      let RrasScedPlotData: PlotData = {
        title: 'RRAS Vs SCED',
        traces: [],
        yAxisTitle: "MW",
        barmode:"group"
      };

      let RrasPlotRace: PlotTrace = {
        name: `RRAS_${rrasScedResData[dateKeyInd].dateKey}`,
        data:rrasScedResData[dateKeyInd].rras,
        type: "bar",
        hoverYaxisDisplay: "MW",
        // barWidth:
      };
      RrasScedPlotData.traces.push(RrasPlotRace);

      let ScedPlotRace: PlotTrace = {
        name: `SCED_${rrasScedResData[dateKeyInd].dateKey}`,
        data:rrasScedResData[dateKeyInd].sced,
        type: "bar",
        hoverYaxisDisplay: "MW",
        // barWidth:5
      };
      RrasScedPlotData.traces.push(ScedPlotRace);
      timeSeriesSetPlotTraces(`rrasCed_${dateKeyInd}_plot`, RrasScedPlotData);
    }   
}