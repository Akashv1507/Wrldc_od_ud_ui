import { getSchVsActDrawlData } from "../fetchDataApi";
import { PlotData, PlotTrace, setPlotTraces } from "../plotUtils";
import{SelectedStateObj} from "./schVsActDrawl"
import {getDifference, getUiPosNeg} from "../helperFunctions"
import {convertIsoString} from '../timeUtils'

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
      if (option.selected && option.value != "WR") {
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
      errorDiv.innerHTML = "<b> Please Select State From Dropdown Other Than WR</b>";
    } else if (startDateValue > endDateValue) {
      errorDiv.classList.add("mt-4", "mb-4", "alert", "alert-danger");
      errorDiv.innerHTML =
        "<b> Ooops !! End Date should be greater or Equal to Start Date </b>";
    } else {  

      // convert '2022-01-24T00:00' to '2022-01-24 00:00:00'
      startDateValue = convertIsoString(startDateValue)
      endDateValue = convertIsoString(endDateValue)
      
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

        //div for plot of a sch act and deviation of current loop state
        let schActPlotDiv = document.createElement('div');
        schActPlotDiv.id = `${selectedStateList[stateInd].name}_schActplot`;
        //div for plot of a sch act and deviation of current loop state
        let freqDevPlotDiv = document.createElement('div');
        freqDevPlotDiv.id = `${selectedStateList[stateInd].name}_freqDevplot`;
        // appending above two divs to plotswrapper
        schVsActDrawlPlotsWrapper.appendChild(schActPlotDiv);
        schVsActDrawlPlotsWrapper.appendChild(freqDevPlotDiv);
  
        // div for plotting horizontal rule
        let hrDiv = document.createElement("div");
        hrDiv.className = "hrStyle mt-3 mb-3";
        schVsActDrawlPlotsWrapper.appendChild(hrDiv);
  
      //  fetch data for each states and plot data in div created above dynamically
       
        const schDrawlData = await getSchVsActDrawlData(startDateValue, endDateValue, `${selectedStateList[stateInd].value}_Schedule`)
        const actDrawlData = await getSchVsActDrawlData(startDateValue, endDateValue, `${selectedStateList[stateInd].value}_Actual`)
        const freqData = await getSchVsActDrawlData(startDateValue, endDateValue, 'Frequency')
        const uiData = getDifference( actDrawlData.schVsActDrawlData, schDrawlData.schVsActDrawlData)
        const uiPosNegData = getUiPosNeg(schDrawlData.schVsActDrawlData, uiData)
        
        let schActDrawlPlotData: PlotData = {
          title: `Schedule Vs Actual Drawl Of ${selectedStateList[stateInd].value} B/w Dates ${startDateValue} And ${endDateValue}`,
          traces: [],
          yAxisTitle: "MW",
          y2AxisTitle:"MW"

      };
  
      let schDrawlTrace: PlotTrace = {
          name: "Schedule",
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
          // fill: "tonextx",
          // fillcolor: '#e763fa'
      };
      schActDrawlPlotData.traces.push(actDrawlTrace);

      let uiTrace: PlotTrace = {
        name: "Deviation",
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

    // let actualCorrToUiNegTrace: PlotTrace = {
    //   name: "ActForUd",
    //   data: uiPosNegData.actualCorrToUiNeg,
    //   type: "scatter",
    //   hoverYaxisDisplay: "MW",
    //   mode: 'markers',
    //   line: {
    //       width: 1,
    //       // color: '#34A853'
    //   },
    //   // fill: "tonextx",
    //   // fillcolor: '#e763fa'
    // };
    // schActDrawlPlotData.traces.push(actualCorrToUiNegTrace);

  //   let actualCorrToUiPosTrace: PlotTrace = {
  //   name: "ActForOd",
  //   data: uiPosNegData.actualCorrToUiPos,
  //   type: "scatter",
  //   hoverYaxisDisplay: "MW", 
  //   mode: 'markers',
  //   line: {
  //       width: 1,
  //       // color: '#34A853'
  //   },
  //   // fill: "tonextx",
  //   // fillcolor: '#e763fa'
  //   };
  // schActDrawlPlotData.traces.push(actualCorrToUiPosTrace);
  
      setPlotTraces(
          `${selectedStateList[stateInd].name}_schActplot`,
          schActDrawlPlotData
      ); 

      // Now plotting frequency vs Deviation Plot
      let FreqDevPlotData: PlotData = {
          title: `Deviation Vs Frequency Of ${selectedStateList[stateInd].value} B/w Dates ${startDateValue} And ${endDateValue}`,
          traces: [],
          yAxisTitle: "Hz",
          y2AxisTitle:"MW"

      };

      let freqTrace: PlotTrace = {
        name: "Frequency",
        data: freqData.schVsActDrawlData,
        type: "scatter",
        hoverYaxisDisplay: "Freq",
        line: {
            width: 2,    
            color: '#FF7F50'
        },
        // fill: "tonextx",
        // fillcolor: '#e763fa'
      };
      FreqDevPlotData.traces.push(freqTrace);

      let uiTraceCopy: PlotTrace = {
        name: "Deviation",
        data: uiData,
        type: "scatter",
        hoverYaxisDisplay: "MW",
        isSecondaryAxisTrace: true,
        line: {
            width: 2,
            color: '#007500',
        },
        // fill: "tonextx",
        // fillcolor: '#e763fa'
      };
      FreqDevPlotData.traces.push(uiTraceCopy);

      setPlotTraces(
        `${selectedStateList[stateInd].name}_freqDevplot`,
        FreqDevPlotData
    ); 

      }catch(err){
        errorDiv.classList.add("mt-4", "mb-4", "alert", "alert-danger")
        errorDiv.innerHTML = `<b>Oops !!! Data Fetch Unsuccessful For ${currState} B/w Selected Date. Please Try Again</b>`
        console.log(err)
        //removing spinnner
        spinnerDiv.classList.remove("loader")
        }   
      }
      // removing spinner class to spinner div
      spinnerDiv.classList.remove("loader")   
    }
  };
  