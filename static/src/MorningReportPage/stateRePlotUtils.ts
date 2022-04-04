import Plotly from "plotly.js-dist";
// declare var Plotly: any;
import { yyyymmddtoDateStr } from "../timeUtils";
import {ISingleStateReData} from "./fetchReportHtml"


export interface StateRePlotTrace {
    name: string;
    // here date in string formate
    data: ISingleStateReData[];
    type: string;
    hoverYaxisDisplay: string;
    mode?: string;
    marker_color: string;
    
}

export interface StateRePlotData {
  title: string;
  traces: StateRePlotTrace[];
  yAxisTitle: string
  barmode?: string
   
}
export interface XYData{
  timestamps: string[]; 
  vals: number[] 
  showTimestamps:string[]
}


export const getPlotXYArrays = (
  measData: StateRePlotTrace["data"]
): XYData => {
  let timestamps: string[] = [];
  let vals: number[] = [];
  let showTimestamps: string[]=[]
  for (var i = 0; i < measData.length; i = i + 1) {
    timestamps.push(yyyymmddtoDateStr(measData[i].dateKey));
    showTimestamps.push(yyyymmddtoDateStr(measData[i].showDateKey));
    vals.push(measData[i].val as number);
  }
  return { timestamps: timestamps, vals: vals, showTimestamps:showTimestamps };
};

export const setPlotTraces = (divId: string, plotData: StateRePlotData) => {

  let traceData = [];
  let xyData:XYData={timestamps:[], vals:[], showTimestamps:[]}

  for (var traceIter = 0; traceIter < plotData.traces.length; traceIter++) {
    const trace = plotData.traces[traceIter];
    xyData = getPlotXYArrays(trace.data);
    // creating different graph for bias error  , which is 2nd index of plotdata.traces
    let traceObj = {
      x: xyData.showTimestamps,
      y: xyData.vals,
      type: trace.type,
      name: trace.name,
      hovertemplate: `(%{x}, %{y:.2f} ${trace.hoverYaxisDisplay})`,
      marker:{color:trace.marker_color},
      text:xyData.vals.map(String)
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
    titlefont: { color: "#000", size: 12 },
    tickfont: { color: "#000", size: 14 },
    tickmode: "array",
    tickvals:xyData.showTimestamps,
    ticktext: xyData.timestamps,
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
    titlefont: { color: "#000"  , size: 14 },
    tickfont: { color: "#000", size: 14 },
    tickformat: "digits",
  },  
  };
  //for only bar plots
  if (plotData.barmode != null) {
      layout["barmode"] = plotData.barmode
  }
  Plotly.newPlot(divId, traceData, layout);
};