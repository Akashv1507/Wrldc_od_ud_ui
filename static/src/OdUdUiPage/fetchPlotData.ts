import {SelectedStateObj} from "./odUdUiIndex"
import {getOdUdData} from "../fetchDataApi"
import {generateOdUdPlotData} from "../helperFunctions"
import { PlotData, PlotTrace, setPlotTraces } from "../plotUtils";

export const fetchPlotData = async () => {
    //to display error msg
    const errorDiv = document.getElementById("errorPlotDiv") as HTMLDivElement;
  
    //to display spinner
    const spinnerDiv = document.getElementById("plotSpinner") as HTMLDivElement;
  
    //to display spinner
    const odUdDataTableWrapper = document.getElementById("odUdPlotsWrapper") as HTMLDivElement;
  
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
    odUdDataTableWrapper.innerHTML = "";
  
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
    
      //if reached this ,means no validation error ,emptying error div and making start date and end date in desired format
      errorDiv.classList.remove("mt-4", "mb-4", "alert", "alert-danger");
      errorDiv.innerHTML = "";

      //to keep track of current state in loop 
       let currState = ""

      //adding spinner class to spinner div
      spinnerDiv.classList.add("loader");
   
      for (let stateInd = 0; stateInd < selectedStateList.length; stateInd++) {
        try{
        currState = selectedStateList[stateInd].value

        //div for plot of a current loop state
        let plotDiv = document.createElement('div');
        plotDiv.id = `${selectedStateList[stateInd].name}_plot`;
        odUdDataTableWrapper.appendChild(plotDiv);
  
        // div for plotting horizontal rule
        let hrDiv = document.createElement("div");
        hrDiv.className = "hrStyle mt-3 mb-3";
        odUdDataTableWrapper.appendChild(hrDiv);
  
        //fetch data for each states and push data to datatble div created above dynamically
        let odUdData = await getOdUdData(startDateValue, endDateValue, selectedStateList[stateInd].value)
        const odUdPlotData = generateOdUdPlotData(odUdData)
        
        //now defining all traces

        let plotData: PlotData = {
            title: `Showing Drawl Details Of ${selectedStateList[stateInd].value} (In MUs) B/w Dates ${startDateValue} And ${endDateValue}`,
            traces: [],
            yAxisTitle: "MUs",
            y2AxisTitle:"MUs"
  
        };
        //sch drawal trace
        let schDrawlTrace: PlotTrace = {
            name: "Schedule Drawl",
            data: odUdPlotData.schDrawal,
            type: "scatter",
            hoverYaxisDisplay: "MUs",
            line: {
                width: 4,
                // color: '#34A853'
            },
            // fill: "tonextx",
        };
        plotData.traces.push(schDrawlTrace);

        //act drawal trace
        let actDrawlTrace: PlotTrace = {
            name: "Actual Drawl",
            data: odUdPlotData.actDrawal,
            type: "scatter",
            hoverYaxisDisplay: "MUs",
            line: {
                width: 4,
                // color: '#34A853'
            },
            // fill: "tonextx",
        };
        plotData.traces.push(actDrawlTrace);

        //UI trace
        let uiTrace: PlotTrace = {
            name: "Deviation",
            data: odUdPlotData.ui,
            type: "scatter",
            hoverYaxisDisplay: "MUs",
            isSecondaryAxisTrace:true,
            line: {
                width: 4,
                // color: '#34A853'
            },
            // fill: "tonextx",
        };
        plotData.traces.push(uiTrace);

        //availability trace
        let shortageTrace: PlotTrace = {
            name: "Availability",
            data: odUdPlotData.availability,
            type: "scatter",
            hoverYaxisDisplay: "MUs",
            visible:"legendonly",
            line: {
                width: 2,
                // color: '#34A853'
            },
            // fill: "tonextx",
        };
        plotData.traces.push(shortageTrace);

        //consumption trace
        let consumptionTrace: PlotTrace = {
            name: "Consumption",
            data: odUdPlotData.consumption,
            type: "scatter",
            hoverYaxisDisplay: "MUs",
            visible:"legendonly",
            line: {
                width: 2,
                // color: '#34A853'
            },
            // fill: "tonextx",
        };
        plotData.traces.push(consumptionTrace);

        //requirement trace
        let requirementTrace: PlotTrace = {
            name: "Requirement",
            data: odUdPlotData.requirement,
            type: "scatter",
            hoverYaxisDisplay: "MUs",
            visible:"legendonly",
            line: {
                width: 2,
                // color: '#34A853'
            },
            // fill: "tonextx",
        };
        plotData.traces.push(requirementTrace);

        setPlotTraces(
            `${selectedStateList[stateInd].name}_plot`,
            plotData
        );

      }catch(err){
        errorDiv.classList.add("mt-4", "mb-4", "alert", "alert-danger")
        errorDiv.innerHTML = `<b>Oops !!! Data Fetch Unsuccessful For ${currState} B/w Selected Date. Please Try Again</b>`
        console.log(err)
        // removing spinner class to spinner div
        spinnerDiv.classList.remove("loader")
      }
    }
    // removing spinner class to spinner div
    spinnerDiv.classList.remove("loader")
    }
};