import{SelectedStateObj} from "./schVsActDrawl"
import { toDateObj } from "../timeUtils";
import { getSchVsActDrawlData } from "../fetchDataApi";
import {getDifference, calMaxMinAvg} from "../helperFunctions"

export interface MaxMinAvgTblRow {

  date: string;
  schMax: number;
  schMin: number;
  schAvg : number;
  actMax: number;
  actMin: number;
  actAvg : number;
  uiMax: number;
  uiMin: number;
  uiAvg : number;
  
  }

export const fetchTableData = async()=>{

    //to display error msg
    const errorDiv = document.getElementById("errorTableDiv") as HTMLDivElement;
  
    //to display spinner
    const spinnerDiv = document.getElementById("tableSpinner") as HTMLDivElement;
  
    //to display spinner
    const schVsActDrawlTableWrapper = document.getElementById("schVsActDrawlTableWrapper") as HTMLDivElement;
  
    //get user inputs
    let startDateValue = (
      document.getElementById("startDate") as HTMLInputElement
    ).value;
    let endDateValue = (document.getElementById("endDate") as HTMLInputElement)
      .value;
  
    const stateOptions = (
      document.getElementById("stateName") as HTMLSelectElement
    ).options;
  
    // clearing earlier div(except for first api call), here all the datatble in schVsActDrawlTableWrapper, and we are emptying it, hence no need to clear datatable
    schVsActDrawlTableWrapper.innerHTML = "";
  
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
  
  try{
      for (let stateInd = 0; stateInd < selectedStateList.length; stateInd++) {
        
        currState = selectedStateList[stateInd].value
        // to store all maxminrows of table
        let allMaxMinAvgTblRows:MaxMinAvgTblRow[] = []

        // div for plotting horizontal rule
        let metaInfoDiv = document.createElement("div");
        metaInfoDiv.className = " text-info text-center mt-3 mb-5 font-weight-bold h5";
        schVsActDrawlTableWrapper.appendChild(metaInfoDiv);

        //div for plot of a current loop state
        let tbl = document.createElement('table');
        tbl.className = "table table-bordered table-hover display w-auto "
        tbl.id = `${selectedStateList[stateInd].name}_tbl`;
        schVsActDrawlTableWrapper.appendChild(tbl);
        
        // div for plotting horizontal rule
        let hrDiv = document.createElement("div");
        hrDiv.className = "hrStyle mt-3 mb-3";
        schVsActDrawlTableWrapper.appendChild(hrDiv);
        
        // converting start date and end date js date obj so that we can looop over it
        const startDateObj = new Date (startDateValue)
        const endDateObj = new Date (endDateValue)
        let currDate = new Date (startDateObj)
        let currDateStr = ""

       //fetch data for each states and for each date, cal min max avg for each day and append to list
        while (currDate<=endDateObj){

          currDateStr =currDate.toISOString().slice(0,10)

          //making api call
          const schDrawlData = await getSchVsActDrawlData(currDateStr, currDateStr, `${selectedStateList[stateInd].value}_Schedule`)
          const actDrawlData = await getSchVsActDrawlData(currDateStr, currDateStr, `${selectedStateList[stateInd].value}_Actual`)
          const uiData = getDifference( schDrawlData.schVsActDrawlData, actDrawlData.schVsActDrawlData)

          const schDrawlMaxMinAvg = calMaxMinAvg(schDrawlData.schVsActDrawlData)
          const actDrawlMaxMinAvg = calMaxMinAvg(actDrawlData.schVsActDrawlData)
          const uiMaxMinAvg = calMaxMinAvg(uiData)
          allMaxMinAvgTblRows.push({date:currDateStr, schMax:schDrawlMaxMinAvg.max, schMin:schDrawlMaxMinAvg.min, schAvg:schDrawlMaxMinAvg.avg, actMax:actDrawlMaxMinAvg.max, actMin:actDrawlMaxMinAvg.min, actAvg:actDrawlMaxMinAvg.avg, uiMax:uiMaxMinAvg.max, uiAvg:uiMaxMinAvg.avg, uiMin:uiMaxMinAvg.min})
          let newDate = currDate.setDate(currDate.getDate()+1)
          currDate = new Date(newDate)
        }
      
         //generating column name
        const columns = [{ title: 'Date_Key', data:"date" },{ title: 'Max_Sch', data:"schMax" }, { title: 'Min_Sch' , data:"schMin" }, { title: 'Avg_Sch', data:"schAvg"  },{ title: 'Max_Act',data:"actMax"  },{ title: 'Min_Act', data:"actMin"  },{ title: 'Avg_Act', data:"actAvg"  },{ title: 'Max_UI', data:"uiMax"  },{ title: 'Min_Ui', data:"uiMin"  }, { title: 'Av_Ui', data:"uiAvg"  } ]
        
        //draw table in div created above dynamically
        $(`#${selectedStateList[stateInd].name}_tbl`).DataTable({
          dom: "Bfrtip",
          lengthMenu: [50, 192, 188],
          data: allMaxMinAvgTblRows,
          columns: columns
      });
      // showing meta information
      metaInfoDiv.innerHTML =  `Showing Max Min Avg of Schedule & Actual Drawal For State ${selectedStateList[stateInd].value}.`
      }
      spinnerDiv.classList.remove("loader")
    }
    catch(err){
      errorDiv.classList.add("mt-4", "mb-4", "alert", "alert-danger")
      errorDiv.innerHTML = `<b>Oops !!! Data Fetch Unsuccessful For ${currState} B/w Selected Date. Please Try Again</b>`
    console.log(err)
    // removing spinner class to spinner div
    spinnerDiv.classList.remove("loader")
      }  
    }       
}
