import{SelectedStateObj} from "./schVsActDrawl"
import { toDateObj } from "../timeUtils";
import { getSchVsActDrawlData } from "../fetchDataApi";
import {getDifference, calMaxMin, getValueCorresTime, getAvgOdUDData, getNetUiActSch, getFreqStats} from "../helperFunctions"
import {createDynamicHtmlContent} from "./dynamicHtmlContentCreator"
import {convertDateTimeToStr} from  "../timeUtils"

export interface InstUiMax{
  date:string
  timestamp: string
  maxUi:number
  correspondingSch:number
  correspondingAct:number
  correspondingFreq:number
}
export interface InstUiMin{
  date:string
  timestamp: string
  minUi:number
  correspondingSch:number
  correspondingAct:number
  correspondingFreq:number
}
export interface AvgOd{
  date:string
  avgOd:number
  correspondingAvgSch:number
  correspondingAvgAct:number
  correspondingFreqLessThanBand:number
}
export interface AvgUd{
  date:string
  avgUd:number
  correspondingAvgSch:number
  correspondingAvgAct:number
  correspondingFreqGreaterThanBand:number
}
export interface NetUi{
  date:string
  netUi:number
  netSch:number
  netAct:number
  freqBetweenBand:number
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
        let netUiActSchRows: NetUi[] = []

        // div for meta info like showing table of which state
        let stateInfoDIv = document.createElement("div");
        stateInfoDIv.className = " text-danger text-center mt-3 mb-2 font-weight-bold h4";
        stateInfoDIv.innerHTML = `Showing Tables Of ${selectedStateList[stateInd].value}. All Figures In MW.`
        schVsActDrawlTableWrapper.appendChild(stateInfoDIv);

        //creating dynamic html div and tables
        createDynamicHtmlContent(selectedStateList[stateInd].name, selectedStateList[stateInd].value, schVsActDrawlTableWrapper )

        // converting start date and end date js date obj so that we can looop over it
        const startDateObj = new Date (startDateValue)
        const endDateObj = new Date (endDateValue)
        let currDate = new Date (startDateObj)
        let currDateStr = ""
        let currDateStrDDMMYYY = ""
       //fetch data for each states and for each date, cal min max avg for each day and append to list
        while (currDate<=endDateObj){
          try{
            currDateStr =currDate.toISOString().slice(0,10)
            let currDateStrDDMMYYY = convertDateTimeToStr(currDate)
 
            //making api call
            const schDrawlData = await getSchVsActDrawlData(currDateStr, currDateStr, `${selectedStateList[stateInd].value}_Schedule`)
            const actDrawlData = await getSchVsActDrawlData(currDateStr, currDateStr, `${selectedStateList[stateInd].value}_Actual`)
            const freqData = await getSchVsActDrawlData(currDateStr, currDateStr, 'Frequency')
            const uiData = getDifference(actDrawlData.schVsActDrawlData, schDrawlData.schVsActDrawlData)

            //get max and min ui with their timestamp
            const uiMaxMin = calMaxMin(uiData)
            //get schedule and actual corresponding to max and min ui timestamp
            const schCorrMaxUi = getValueCorresTime(schDrawlData.schVsActDrawlData ,uiMaxMin.max.timestamp)
            const actCorrMaxUi = getValueCorresTime(actDrawlData.schVsActDrawlData ,uiMaxMin.max.timestamp)
            const freqCorrMaxUi = getValueCorresTime(freqData.schVsActDrawlData, uiMaxMin.max.timestamp, false)
            const schCorrMinUi = getValueCorresTime(schDrawlData.schVsActDrawlData ,uiMaxMin.min.timestamp)
            const actCorrMinUi = getValueCorresTime(actDrawlData.schVsActDrawlData ,uiMaxMin.min.timestamp)
            const freqCorrMinUi = getValueCorresTime(freqData.schVsActDrawlData, uiMaxMin.min.timestamp, false)

            instUiMaxRows.push({date:currDateStrDDMMYYY, maxUi:uiMaxMin.max.value, timestamp:uiMaxMin.max.timestamp.slice(11), correspondingSch:schCorrMaxUi, correspondingAct:actCorrMaxUi, correspondingFreq:freqCorrMaxUi })
            instUiMinRows.push({date:currDateStrDDMMYYY, minUi:uiMaxMin.min.value, timestamp:uiMaxMin.min.timestamp.slice(11), correspondingSch:schCorrMinUi, correspondingAct:actCorrMinUi, correspondingFreq:freqCorrMinUi})

            //get avg sch , avg act coressponidng to avg od ud and percentage of time less than band for OD and percentage of time greter than band for UD
            const avgOdUdData = getAvgOdUDData(actDrawlData.schVsActDrawlData, schDrawlData.schVsActDrawlData)
            const freqStatsData = getFreqStats(actDrawlData.schVsActDrawlData, schDrawlData.schVsActDrawlData, freqData.schVsActDrawlData)
            avgOdRows.push({date:currDateStrDDMMYYY, avgOd:avgOdUdData.avgOd, correspondingAvgAct:avgOdUdData.avgActCorrOd, correspondingAvgSch:avgOdUdData.avgSchCorrOd, correspondingFreqLessThanBand:+freqStatsData.countLessThanBandForOd})
            avgUdRows.push({date:currDateStrDDMMYYY, avgUd:avgOdUdData.avgUd, correspondingAvgAct:avgOdUdData.avgActCorrUd, correspondingAvgSch:avgOdUdData.avgSchCorrUd, correspondingFreqGreaterThanBand: +freqStatsData.countGreaterThanBandForUd})
            
            //get net ui and net sch, actual drawal
            const netUiActSch = getNetUiActSch(actDrawlData.schVsActDrawlData, schDrawlData.schVsActDrawlData)
            netUiActSchRows.push({date:currDateStrDDMMYYY, netUi:netUiActSch.netUi, netAct:netUiActSch.netAct, netSch:netUiActSch.netSch, freqBetweenBand: +freqStatsData.countBetweenBand})

          }catch(err){
            errorDiv.classList.add("mt-4", "mb-4", "alert", "alert-danger")
            errorDiv.innerHTML = `<b>Oops !!! Data Fetch Unsuccessful For ${selectedStateList[stateInd].value} For ${currDateStr}. Please Try Again</b>`
          }finally{
            let newDate = currDate.setDate(currDate.getDate()+1)
            currDate = new Date(newDate)
          }
            
          }
         //generating column name
        const minUiCols = [{ title: 'Date', data:"date" },{ title: 'Timestamp', data:"timestamp" }, { title: 'Max_UD' , data:"minUi" }, { title: 'Schedule', data:"correspondingSch"  },{ title: 'Actual', data:"correspondingAct"}, { title: 'Frequency', data:"correspondingFreq"}]
        const maxUiCols = [{ title: 'Date', data:"date" },{ title: 'Timestamp', data:"timestamp" }, { title: 'Max_OD' , data:"maxUi" }, { title: 'Schedule', data:"correspondingSch"  },{ title: 'Actual', data:"correspondingAct"}, { title: 'Frequency', data:"correspondingFreq"}]
        const avgOdCols = [{ title: 'Date', data:"date" }, { title: 'Avg_OD', data:"avgOd" },{ title: 'Avg_Act', data:"correspondingAvgAct" },{ title: 'Avg_Sch', data:"correspondingAvgSch" }, { title: 'Freq<49.9', data:"correspondingFreqLessThanBand" }]
        const avgUdCols = [{ title: 'Date', data:"date" }, { title: 'Avg_UD', data:"avgUd" },{ title: 'Avg_Act', data:"correspondingAvgAct" },{ title: 'Avg_Sch', data:"correspondingAvgSch" }, { title: 'Freq>51.05', data:"correspondingFreqGreaterThanBand" }]
        const netUiCols = [{ title: 'Date', data:"date" }, { title: 'Net_Deviation', data:"netUi" },{ title: 'Net_Act', data:"netAct" },{ title: 'Net_Sch', data:"netSch" }, { title: 'Freq Between Band', data:"freqBetweenBand" }]

        //draw table instantaneous max ui and corresponding shcedule and actual
        $(`#${selectedStateList[stateInd].name}_maxUiTbl`).DataTable({
          dom: "Brtp",
          autoWidth: false,
          lengthMenu: [50, 192, 188],
          data: instUiMaxRows,
          columns: maxUiCols
          });

        //draw table instantaneous min ui and corresponding shcedule and actual
        $(`#${selectedStateList[stateInd].name}_minUiTbl`).DataTable({
          dom: "Brtp",
          autoWidth: false,
          lengthMenu: [50, 192, 188],
          data: instUiMinRows,
          columns: minUiCols
          })

        //draw table avg od and corresponding avg shcedule and actual
        $(`#${selectedStateList[stateInd].name}_avgOdTbl`).DataTable({
          dom: "Brtp",
          autoWidth: false,
          lengthMenu: [50, 192, 188],
          data: avgOdRows,
          columns: avgOdCols
          })

          //draw table avg ud and corresponding avg shcedule and actual
        $(`#${selectedStateList[stateInd].name}_avgUdTbl`).DataTable({
          dom: "Brtp",
          autoWidth: false,
          lengthMenu: [50, 192, 188],
          data: avgUdRows,
          columns: avgUdCols
          })

          //draw table net ui and net shcedule and actual
        $(`#${selectedStateList[stateInd].name}_netUiTbl`).DataTable({
          dom: "Brtp",
          autoWidth: false,
          lengthMenu: [50, 192, 188],
          data: netUiActSchRows,
          columns: netUiCols
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