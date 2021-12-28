import{SelectedStateObj} from "./schVsActDrawl"
import { toDateObj } from "../timeUtils";
import { getSchVsActDrawlData } from "../fetchDataApi";
import {getDifference, calMaxMin, getValueCorresTime, getAvgOdUDData} from "../helperFunctions"
import {createDynamicHtmlContent} from "./dynamicHtmlContentCreator"


export interface InstUiMax{
  date:string
  timestamp: string
  maxUi:number
  correspondingSch:number
  correspondingAct:number
}
export interface InstUiMin{
  date:string
  timestamp: string
  minUi:number
  correspondingSch:number
  correspondingAct:number
}
export interface AvgOd{
  date:string
  avgOd:number
  correspondingAvgSch:number
  correspondingAvgAct:number
}
export interface AvgUd{
  date:string
  avgUd:number
  correspondingAvgSch:number
  correspondingAvgAct:number
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
      
      //adding spinner class to spinner div
      spinnerDiv.classList.add("loader");
  
      for (let stateInd = 0; stateInd < selectedStateList.length; stateInd++) {
        try{
        // to store all maxmin rows of table
        let instUiMaxRows:InstUiMax[] = []
        let instUiMinRows:InstUiMin[] = []
        let avgOdRows :AvgOd[] = []
        let avgUdRows: AvgUd[] = []

        // div for meta info like showing table of which state
        let stateInfoDIv = document.createElement("div");
        stateInfoDIv.className = " text-danger text-center mt-3 mb-2 font-weight-bold h4";
        stateInfoDIv.innerHTML = `Showing Tables of ${selectedStateList[stateInd].value}`
        schVsActDrawlTableWrapper.appendChild(stateInfoDIv);

        //creating dynamic html div and tables
        createDynamicHtmlContent(selectedStateList[stateInd].name, selectedStateList[stateInd].value, schVsActDrawlTableWrapper )

        // converting start date and end date js date obj so that we can looop over it
        const startDateObj = new Date (startDateValue)
        const endDateObj = new Date (endDateValue)
        let currDate = new Date (startDateObj)
        let currDateStr = ""

       //fetch data for each states and for each date, cal min max avg for each day and append to list
        while (currDate<=endDateObj){
          try{
            currDateStr =currDate.toISOString().slice(0,10)
 
            //making api call
            const schDrawlData = await getSchVsActDrawlData(currDateStr, currDateStr, `${selectedStateList[stateInd].value}_Schedule`)
            const actDrawlData = await getSchVsActDrawlData(currDateStr, currDateStr, `${selectedStateList[stateInd].value}_Actual`)
            const uiData = getDifference(actDrawlData.schVsActDrawlData, schDrawlData.schVsActDrawlData)

            //get max and min ui with their timestamp
            const uiMaxMin = calMaxMin(uiData)
            //get schedule and actual corresponding to max and min ui timestamp
            const schCorrMaxUi = getValueCorresTime(schDrawlData.schVsActDrawlData ,uiMaxMin.max.timestamp)
            const actCorrMaxUi = getValueCorresTime(actDrawlData.schVsActDrawlData ,uiMaxMin.max.timestamp)
            const schCorrMinUi = getValueCorresTime(schDrawlData.schVsActDrawlData ,uiMaxMin.min.timestamp)
            const actCorrMinUi = getValueCorresTime(actDrawlData.schVsActDrawlData ,uiMaxMin.min.timestamp)

            instUiMaxRows.push({date:currDateStr, maxUi:uiMaxMin.max.value, timestamp:uiMaxMin.max.timestamp.slice(11), correspondingSch:schCorrMaxUi, correspondingAct:actCorrMaxUi})
            instUiMinRows.push({date:currDateStr, minUi:uiMaxMin.min.value, timestamp:uiMaxMin.min.timestamp.slice(11), correspondingSch:schCorrMinUi, correspondingAct:actCorrMinUi})

            //get avg sch , avg act coressponidng to avg od ud
            const avgOdUdData = getAvgOdUDData(actDrawlData.schVsActDrawlData, schDrawlData.schVsActDrawlData)
            avgOdRows.push({date:currDateStr, avgOd:avgOdUdData.avgOd, correspondingAvgAct:avgOdUdData.avgActCorrOd, correspondingAvgSch:avgOdUdData.avgSchCorrOd})
            avgUdRows.push({date:currDateStr, avgUd:avgOdUdData.avgUd, correspondingAvgAct:avgOdUdData.avgActCorrUd, correspondingAvgSch:avgOdUdData.avgSchCorrUd})

          }catch(err){
            errorDiv.classList.add("mt-4", "mb-4", "alert", "alert-danger")
            errorDiv.innerHTML = `<b>Oops !!! Data Fetch Unsuccessful For ${selectedStateList[stateInd].value} For ${currDateStr}. Please Try Again</b>`
          }finally{
            let newDate = currDate.setDate(currDate.getDate()+1)
            currDate = new Date(newDate)
          }
            
          }
         //generating column name
        const minUiCols = [{ title: 'Date', data:"date" },{ title: 'Timesatmp', data:"timestamp" }, { title: 'Min_UI' , data:"minUi" }, { title: 'Schedule', data:"correspondingSch"  },{ title: 'Actual', data:"correspondingAct"  }]
        const maxUiCols = [{ title: 'Date', data:"date" },{ title: 'Timesatmp', data:"timestamp" }, { title: 'Max_UI' , data:"maxUi" }, { title: 'Schedule', data:"correspondingSch"  },{ title: 'Actual', data:"correspondingAct"  }]
        const avgOdCols = [{ title: 'Date', data:"date" }, { title: 'Avg_OD', data:"avgOd" },{ title: 'Avg_Act', data:"correspondingAvgAct" },{ title: 'Avg_Sch', data:"correspondingAvgSch" }]
        const avgUdCols = [{ title: 'Date', data:"date" }, { title: 'Avg_UD', data:"avgUd" },{ title: 'Avg_Act', data:"correspondingAvgAct" },{ title: 'Avg_Sch', data:"correspondingAvgSch" }]

        //draw table in div created above dynamically
        $(`#${selectedStateList[stateInd].name}_maxUiTbl`).DataTable({
          dom: "Brtp",
          autoWidth: false,
          lengthMenu: [50, 192, 188],
          data: instUiMaxRows,
          columns: maxUiCols
          });

        //draw table in div created above dynamically
        $(`#${selectedStateList[stateInd].name}_minUiTbl`).DataTable({
          dom: "Brtp",
          autoWidth: false,
          lengthMenu: [50, 192, 188],
          data: instUiMinRows,
          columns: minUiCols
          })

          //draw table in div created above dynamically
        $(`#${selectedStateList[stateInd].name}_avgOdTbl`).DataTable({
          dom: "Brtp",
          autoWidth: false,
          lengthMenu: [50, 192, 188],
          data: avgOdRows,
          columns: avgOdCols
          })

          //draw table in div created above dynamically
        $(`#${selectedStateList[stateInd].name}_avgUdTbl`).DataTable({
          dom: "Brtp",
          autoWidth: false,
          lengthMenu: [50, 192, 188],
          data: avgUdRows,
          columns: avgUdCols
          })

      }
      catch(err){
        errorDiv.classList.add("mt-4", "mb-4", "alert", "alert-danger")
        errorDiv.innerHTML = `<b>Oops !!! Data Fetch Unsuccessful For ${selectedStateList[stateInd].value} B/w Selected Date. Please Try Again</b>`
      }
    }      
    spinnerDiv.classList.remove("loader")  
    }
}