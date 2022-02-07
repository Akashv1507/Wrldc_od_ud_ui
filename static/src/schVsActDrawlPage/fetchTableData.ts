import{SelectedStateObj} from "./schVsActDrawl"
import { getSchVsActDrawlData } from "../fetchDataApi";
import {getDifference, calMaxMin, getValueCorresTime, getAvgOdUDData, getNetUiActSch, getFreqStats} from "../helperFunctions"
import {createDynamicHtmlContent} from "./dynamicHtmlContentCreator"
import {yyyyddmmToddmmyyy, convertIsoString, getListOfDates, getMultiplyingFactorMus} from  "../timeUtils"

export interface InstUiMax{
  date:string
  timestamp: string
  maxUi:number
  correspondingSch:number
  correspondingAct:number
  correspondingFreq:number
  odGreaterThan250InMin: number
  percentOdGreaterThan250InMin:number
}
export interface InstUiMin{
  date:string
  timestamp: string
  minUi:number
  correspondingSch:number
  correspondingAct:number
  correspondingFreq:number
  udGreaterThan250InMin: number
  percentUdGreaterThan250InMin:number
}
export interface AvgOd{
  date:string
  avgOd:number
  mus:number
  correspondingAvgSch:number
  correspondingAvgAct:number
  correspondingFreqLessThanBand:number
}
export interface AvgUd{
  date:string
  avgUd:number
  mus:number
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
export interface InstMinFreq{
  date:string
  timestamp: string
  minFreq:number
  correspondingUi:number
  
}
export interface InstMaxFreq{
  date:string
  timestamp: string
  maxFreq:number
  correspondingUi:number
  
}


export const fetchTableData = async()=>{
   
    //to display error msg
    const errorDiv = document.getElementById("errorTableDiv") as HTMLDivElement;
  
    //to display spinner
    const spinnerDiv = document.getElementById("tableSpinner") as HTMLDivElement;
  
    //to display tables
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
      // convert '2022-01-24T00:00' to '2022-01-24 00:00:00'
      startDateValue = convertIsoString(startDateValue)
      endDateValue = convertIsoString(endDateValue)
      let datesChunksList = getListOfDates(startDateValue, endDateValue)
      
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
        let instMaxFreqRows: InstMaxFreq[]=[]
        let instMinFreqRows: InstMinFreq[]=[]

        // div for meta info like showing table of which state
        let stateInfoDIv = document.createElement("div");
        stateInfoDIv.className = " text-danger text-center mt-3 mb-2 font-weight-bold h4";
        stateInfoDIv.innerHTML = `Showing Tables Of ${selectedStateList[stateInd].value}.`
        schVsActDrawlTableWrapper.appendChild(stateInfoDIv);

        //creating dynamic html div and tables
        createDynamicHtmlContent(selectedStateList[stateInd].name, schVsActDrawlTableWrapper)

       //fetch data for each states and for each date, cal min max avg for each day and append to list
       for(let ind=0;ind<datesChunksList.length;ind++){
          try{
            
            let currDateStrDDMMYYY = yyyyddmmToddmmyyy(datesChunksList[ind].startTime)
            
            //making api call
            const schDrawlData = await getSchVsActDrawlData(datesChunksList[ind].startTime, datesChunksList[ind].endTime, `${selectedStateList[stateInd].value}_Schedule`)
            const actDrawlData = await getSchVsActDrawlData(datesChunksList[ind].startTime, datesChunksList[ind].endTime, `${selectedStateList[stateInd].value}_Actual`)
            const freqData = await getSchVsActDrawlData(datesChunksList[ind].startTime, datesChunksList[ind].endTime, 'Frequency')
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

            //get avg sch , avg act coressponidng to avg od ud and percentage of time less than band for OD and percentage of time greter than band for UD
            const avgOdUdData = getAvgOdUDData(actDrawlData.schVsActDrawlData, schDrawlData.schVsActDrawlData)
            const freqStatsData = getFreqStats(actDrawlData.schVsActDrawlData, schDrawlData.schVsActDrawlData, freqData.schVsActDrawlData)

            //pushing rows for current date
            instUiMaxRows.push({date:currDateStrDDMMYYY, maxUi:uiMaxMin.max.value, timestamp:uiMaxMin.max.timestamp.slice(11), correspondingSch:schCorrMaxUi, correspondingAct:actCorrMaxUi, correspondingFreq:freqCorrMaxUi, odGreaterThan250InMin:avgOdUdData.countOdInMin, percentOdGreaterThan250InMin:+avgOdUdData["%countOdInMin"] })
            instUiMinRows.push({date:currDateStrDDMMYYY, minUi:uiMaxMin.min.value, timestamp:uiMaxMin.min.timestamp.slice(11), correspondingSch:schCorrMinUi, correspondingAct:actCorrMinUi, correspondingFreq:freqCorrMinUi, udGreaterThan250InMin:avgOdUdData.countUdInMin, percentUdGreaterThan250InMin: +avgOdUdData["%countUdInMin"]})
            avgOdRows.push({date:currDateStrDDMMYYY, avgOd:avgOdUdData.avgOd, mus:+avgOdUdData.odMus, correspondingAvgAct:avgOdUdData.avgActCorrOd, correspondingAvgSch:avgOdUdData.avgSchCorrOd, correspondingFreqLessThanBand:+freqStatsData.countLessThanBandForOd})
            avgUdRows.push({date:currDateStrDDMMYYY, avgUd:avgOdUdData.avgUd, mus:+avgOdUdData.udMus,correspondingAvgAct:avgOdUdData.avgActCorrUd, correspondingAvgSch:avgOdUdData.avgSchCorrUd, correspondingFreqGreaterThanBand: +freqStatsData.countGreaterThanBandForUd})
            
            //get net ui and net sch, actual drawal
            const netUiActSch = getNetUiActSch(actDrawlData.schVsActDrawlData, schDrawlData.schVsActDrawlData)
            netUiActSchRows.push({date:currDateStrDDMMYYY, netUi:netUiActSch.netUi, netAct:netUiActSch.netAct, netSch:netUiActSch.netSch, freqBetweenBand: +freqStatsData.countBetweenBand})

            // new added tbl of min max frequency time and corresponding od,ud
            // get max min frequency and corresponding timestamp
            const freqMaxMin = calMaxMin(freqData.schVsActDrawlData, false)
            const uiCorrMaxFreq = getValueCorresTime(uiData, freqMaxMin.max.timestamp)
            const uiCorrMinFreq = getValueCorresTime(uiData, freqMaxMin.min.timestamp)
            instMaxFreqRows.push({date:currDateStrDDMMYYY, timestamp:freqMaxMin.max.timestamp, maxFreq:freqMaxMin.max.value, correspondingUi:uiCorrMaxFreq})
            instMinFreqRows.push({date:currDateStrDDMMYYY, timestamp:freqMaxMin.min.timestamp,minFreq:freqMaxMin.min.value, correspondingUi:uiCorrMinFreq})

          }catch(err){
            errorDiv.classList.add("mt-4", "mb-4", "alert", "alert-danger")
            errorDiv.innerHTML = `<b>Oops !!! Data Fetch Unsuccessful For ${selectedStateList[stateInd].value} For ${datesChunksList[ind].startTime.substring(0,10)}. Please Try Again</b>`
          }
            
        }//For loop end

         //generating column name
        const minUiCols = [{ title: 'Date', data:"date" },{ title: 'Timestamp', data:"timestamp" }, { title: 'Max_UD' , data:"minUi" }, { title: 'Schedule', data:"correspondingSch"  },{ title: 'Actual', data:"correspondingAct"}, { title: 'Frequency', data:"correspondingFreq"}, {title:'UD>250(In Mins)', data:"udGreaterThan250InMin"}, {title:'UD>250(In %)', data:"percentUdGreaterThan250InMin"}]
        const maxUiCols = [{ title: 'Date', data:"date" },{ title: 'Timestamp', data:"timestamp" }, { title: 'Max_OD' , data:"maxUi" }, { title: 'Schedule', data:"correspondingSch"  },{ title: 'Actual', data:"correspondingAct"}, { title: 'Frequency', data:"correspondingFreq"}, {title:'OD>250(In Mins)', data:"odGreaterThan250InMin"}, {title:'OD>250(In %)', data:"percentOdGreaterThan250InMin"}]
        const avgOdCols = [{ title: 'Date', data:"date" }, { title: 'Avg_OD', data:"avgOd" }, { title: 'OD(MUs)', data:"mus" },{ title: 'Avg_Act', data:"correspondingAvgAct" },{ title: 'Avg_Sch', data:"correspondingAvgSch" }, { title: '%Freq<49.9', data:"correspondingFreqLessThanBand" }]
        const avgUdCols = [{ title: 'Date', data:"date" }, { title: 'Avg_UD', data:"avgUd" }, { title: 'UD(MUs)', data:"mus" }, { title: 'Avg_Act', data:"correspondingAvgAct" },{ title: 'Avg_Sch', data:"correspondingAvgSch" }, { title: '%Freq>50.05', data:"correspondingFreqGreaterThanBand" }]
        const netUiCols = [{ title: 'Date', data:"date" }, { title: 'Net_Deviation', data:"netUi" },{ title: 'Net_Act', data:"netAct" },{ title: 'Net_Sch', data:"netSch" }, { title: '% Freq Between Band', data:"freqBetweenBand" }]
        const minFreqCols= [{title:'Date', data:'date'}, {title:'Timestamp', data:'timestamp'}, {title:'Min_Freq', data:'minFreq'},{title:'Corr-Deviation', data:'correspondingUi'}]
        const maxFreqCols= [{title:'Date', data:'date'}, {title:'Timestamp', data:'timestamp'}, {title:'Max_Freq', data:'maxFreq'},{title:'Corr-Deviation', data:'correspondingUi'}]

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

        //draw table instantaneous max Frequency and corresponding deviation
        $(`#${selectedStateList[stateInd].name}_maxFreqTbl`).DataTable({
          dom: "Brtp",
          autoWidth: false,
          lengthMenu: [50, 192, 188],
          data: instMaxFreqRows,
          columns: maxFreqCols
          });
        
        //draw table instantaneous min Frequency and corresponding deviation
        $(`#${selectedStateList[stateInd].name}_minFreqTbl`).DataTable({
          dom: "Brtp",
          autoWidth: false,
          lengthMenu: [50, 192, 188],
          data: instMinFreqRows,
          columns: minFreqCols
          });

      }
      catch(err){
        errorDiv.classList.add("mt-4", "mb-4", "alert", "alert-danger")
        errorDiv.innerHTML = `<b>Oops !!! Data Fetch Unsuccessful For ${selectedStateList[stateInd].value} B/w Selected Date. Please Try Again</b>`
      }
    }      
    spinnerDiv.classList.remove("loader")  
    }
}