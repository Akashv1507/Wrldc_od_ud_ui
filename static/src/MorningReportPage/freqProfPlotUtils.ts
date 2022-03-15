// import Plotly from "plotly.js-dist";
declare var Plotly: any;
import { toDateObj, yyyymmddtoDateObj } from "../timeUtils";
import {IFreqProfileObj} from "./fetchReportHtml"


export interface FreqProfPlotTrace {
    name: string;
    // here date in string formate
    data: IFreqProfileObj[];
    type: string;
    hoverYaxisDisplay: string;
    mode?: string;
    // marker_color?: string;
    
}

export interface FreqProfPlotData {
  title: string;
  traces: FreqProfPlotTrace[];
  yAxisTitle: string
  barmode?: string
   
}
export interface XYData{
  parNamesList: string[]; 
  valueList: number[] 
  
}


export const getPlotXYArrays = (
  measData: FreqProfPlotTrace["data"]
): XYData => {
  let parNames: string[] = [];
  let values: number[] = [];
 
  for (var i = 0; i < measData.length; i = i + 1) {
    parNames.push(measData[i].parName as string);
    values.push(measData[i].value as number);
  }
  return { parNamesList:parNames, valueList:values };
};

export const setPlotTraces = (divId: string, plotData: FreqProfPlotData) => {

  let traceData = [];
  let xyData:XYData={parNamesList:[], valueList:[], }

  for (var traceIter = 0; traceIter < plotData.traces.length; traceIter++) {
    const trace = plotData.traces[traceIter];
    xyData = getPlotXYArrays(trace.data);
    // creating different graph for bias error  , which is 2nd index of plotdata.traces
    let traceObj = {
      x: xyData.parNamesList,
      y: xyData.valueList,
      type: trace.type,
      name: trace.name,
      hovertemplate: `(%{x}, %{y:.2f} ${trace.hoverYaxisDisplay})`,
      // marker:{color:trace.marker_color},
      text:xyData.valueList.map(String)
    };
    if (trace.mode != null) {
        traceObj["mode"] = trace.mode;
    }
    traceData.push(traceObj);
  }
  
  // setting layout outside of for loop
  const layout = {
    title: {
      text: plotData.title,
      font: {
        size: 20,
        color:"#17a2b8",
      },
    },
  showlegend: true,
  legend: {
    orientation: "h",
    // y: -0.4,
    x: 0.2,
    
    font: {
      family: "sans-serif",
      size: 15,
    },
  },
  hovermode: 'x',
  autosize: true,
    // width: 1500,
    // height: 750,
  bargap:0.5,
  xaxis: {
    showgrid: false,
    zeroline: true,
    showspikes: true,
    spikethickness: 1,
    showline: true,
    titlefont: { color: "#000", size: 16 },
    tickfont: { color: "#000", size: 16 },
    automargin: false,
    // tickangle: 283,
  },
  yaxis: {
        title: plotData.yAxisTitle,
    showgrid: true,
    zeroline: true,
    showspikes: true,
    spikethickness: 1,
    showline: true,
    automargin: true,
    titlefont: { color: "#000"  , size: 16 },
    tickfont: { color: "#000", size: 16 },
    tickformat: "digits",
  },  
  };
  //for only bar plots
  if (plotData.barmode != null) {
      layout["barmode"] = plotData.barmode
  }
  Plotly.newPlot(divId, traceData, layout);
};