import { getSchVsActDrawlData } from "../fetchDataApi";
import { PlotData, PlotTrace, setPlotTraces } from "../plotUtils";
import{SelectedStateObj} from "./schVsActDrawl"
import {getDifference} from "../helperFunctions"

export const fetchPlotData = async () => {
    //to display error msg
    const errorDiv = document.getElementById("errorPlotDiv") as HTMLDivElement;
  
    //to display spinner
    const spinnerDiv = document.getElementById("plotSpinner") as HTMLDivElement;
  
    //to display spinner
    const schVsActDrawlPlotsWrapper = document.getElementById("schVsActDrawlPlotsWrapper") as HTMLDivElement;
  
    //get user inputs
    let startDateValue = (
      document.getElementById("startDate") as HTMLInputElement
    ).value;
    let endDateValue = (document.getElementById("endDate") as HTMLInputElement)
      .value;
  
    const stateOptions = (
      document.getElementById("stateName") as HTMLSelectElement
    ).options;
  
    // clearing earlier div(except for first api call), here all the datatble in odUdDataTableWrapper, and we are emptying it, hence no need to clear datatable
    schVsActDrawlPlotsWrapper.innerHTML = "";
  
    let selectedStateList: SelectedStateObj[] = [];
    for (let option of stateOptions) {
      if (option.selected) {
        let selecetedStateObj: SelectedStateObj = {
          name: option.text,
          value: option.value,
        };
        selectedStateList.push(selecetedStateObj);
      }
    }
    //validation checks, and displaying msg in error div
    if (startDateValue === "" || endDateValue === "") {
      errorDiv.classList.add("mt-4", "mb-4", "alert", "alert-danger");
      errorDiv.innerHTML = "<b> Please Enter a Valid Start Date/End Date</b>";
    } else if (selectedStateList.length == 0) {
      errorDiv.classList.add("mt-4", "mb-4", "alert", "alert-danger");
      errorDiv.innerHTML = "<b> Please Select State From Dropdown</b>";
    } else if (startDateValue > endDateValue) {
      errorDiv.classList.add("mt-4", "mb-4", "alert", "alert-danger");
      errorDiv.innerHTML =
        "<b> Ooops !! End Date should be greater or Equal to Start Date </b>";
    } else {  
      //to keep track of current state in loop 
      let currState = ""

      //if reached this ,means no validation error ,emptying error div and making start date and end date in desired format
      errorDiv.classList.remove("mt-4", "mb-4", "alert", "alert-danger");
      errorDiv.innerHTML = "";
  
      //adding spinner class to spinner div
      spinnerDiv.classList.add("loader");
  
      for (let stateInd = 0; stateInd < selectedStateList.length; stateInd++) {
        try{
        currState = selectedStateList[stateInd].value

        //div for plot of a current loop state
        let plotDiv = document.createElement('div');
        plotDiv.id = `${selectedStateList[stateInd].name}_plot`;
        schVsActDrawlPlotsWrapper.appendChild(plotDiv);
  
        // div for plotting horizontal rule
        let hrDiv = document.createElement("div");
        hrDiv.className = "hrStyle mt-3 mb-3";
        schVsActDrawlPlotsWrapper.appendChild(hrDiv);
  
       //fetch data for each states and plot data in div created above dynamically
       
        const schDrawlData = await getSchVsActDrawlData(startDateValue, endDateValue, `${selectedStateList[stateInd].value}_Schedule`)
        const actDrawlData = await getSchVsActDrawlData(startDateValue, endDateValue, `${selectedStateList[stateInd].value}_Actual`)
        const uiData = getDifference( actDrawlData.schVsActDrawlData, schDrawlData.schVsActDrawlData)
        
        let schActDrawlPlotData: PlotData = {
          title: `Schedule Vs Actual Drawl Of ${selectedStateList[stateInd].value} B/w Dates ${startDateValue} And ${endDateValue}`,
          traces: [],
          yAxisTitle: "MW",
          y2AxisTitle:"Mw"

      };
  
      let schDrawlTrace: PlotTrace = {
          name: "Schedule Drawl",
          data: schDrawlData.schVsActDrawlData,
          type: "scatter",
          hoverYaxisDisplay: "MW",
          line: {
              width: 4,
              // color: '#34A853'
          },
          // fill: "tonextx",
      };
      schActDrawlPlotData.traces.push(schDrawlTrace);
  
      let actDrawlTrace: PlotTrace = {
          name: "Actual Drawl",
          data: actDrawlData.schVsActDrawlData,
          type: "scatter",
          hoverYaxisDisplay: "MW",
          line: {
              width: 4,
              // color: '#34A853'
          },
          fill: "tonextx",
          fillcolor: '#e763fa'
      };
      schActDrawlPlotData.traces.push(actDrawlTrace);

      let uiTrace: PlotTrace = {
        name: "UI",
        data: uiData,
        type: "scatter",
        hoverYaxisDisplay: "MW",
        isSecondaryAxisTrace: true,
        line: {
            width: 1,
            // color: '#34A853'
        },
        // fill: "tonextx",
        // fillcolor: '#e763fa'
    };
    schActDrawlPlotData.traces.push(uiTrace);
  
      setPlotTraces(
          `${selectedStateList[stateInd].name}_plot`,
          schActDrawlPlotData
      ); 
      }catch(err){
        errorDiv.classList.add("mt-4", "mb-4", "alert", "alert-danger")
        errorDiv.innerHTML = `<b>Oops !!! Data Fetch Unsuccessful For ${currState} B/w Selected Date. Please Try Again</b>`
        // console.log(err)
        //removing spinnner
        spinnerDiv.classList.remove("loader")
        }   
      }
      // removing spinner class to spinner div
      spinnerDiv.classList.remove("loader")   
    }
  };
  