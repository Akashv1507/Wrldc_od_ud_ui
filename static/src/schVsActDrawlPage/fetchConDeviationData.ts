import{SelectedStateObj} from "./schVsActDrawl"
import { getContDeviationData } from "../fetchDataApi";
import {createDevTblDynamicHtml} from "./devTblDynamicHtmlContent"
import {yyyyddmmToddmmyyy, convertIsoString, getListOfDates} from  "../timeUtils"

export interface ContinuousOd{
  date:string
  fromTb:string
  toTb:string
  avgOd :number
  minOd:number
  maxOd:number
}
export interface ContinuousUd{
  date:string
  fromTb:string
  toTb:string
  avgUd :number
  minUd:number
  maxUd:number
}

export const fetchDevTableData = async()=>{
   
    //to display error msg
    const errorDiv = document.getElementById("errorContDevTableDiv") as HTMLDivElement;
  
    //to display spinner
    const spinnerDiv = document.getElementById("contDeviationTableSpinner") as HTMLDivElement;
  
    //to display tables
    const contDeviationTableWrapper = document.getElementById("contDeviationTableWrapper") as HTMLDivElement;
  
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
    contDeviationTableWrapper.innerHTML = "";
  
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
       let contOdRows: ContinuousOd[]=[]
       let contUdRows: ContinuousUd[]=[]

        // div for meta info like showing table of which state
        let stateInfoDIv = document.createElement("div");
        stateInfoDIv.className = " text-danger text-center mt-3 mb-2 font-weight-bold h4";
        stateInfoDIv.innerHTML = `Showing Tables Of ${selectedStateList[stateInd].value}.`
        contDeviationTableWrapper.appendChild(stateInfoDIv);

        //creating dynamic html div and tables
        createDevTblDynamicHtml(selectedStateList[stateInd].name, contDeviationTableWrapper )

       //fetch data for each states and for each date, cal min max avg for each day and append to list
       for(let ind=0;ind<datesChunksList.length;ind++){
          try{
            
            let currDateStrDDMMYYY = yyyyddmmToddmmyyy(datesChunksList[ind].startTime)
            //making api call
            const contDeviationData = await getContDeviationData(datesChunksList[ind].startTime, datesChunksList[ind].endTime, selectedStateList[stateInd].value)

            //pushing rows for current date to countOdrows list and countUdRows list
            for (let i=0 ;i<contDeviationData.odListObj.length; i++){
              contOdRows.push({date:currDateStrDDMMYYY, fromTb:contDeviationData.odListObj[i].fromTb, toTb:contDeviationData.odListObj[i].toTb, avgOd:contDeviationData.odListObj[i].avgDeviation, maxOd:contDeviationData.odListObj[i].maxDeviation, minOd:contDeviationData.odListObj[i].minDeviation })
            }
            for (let i=0 ;i<contDeviationData.udListObj.length; i++){
              // here maxUd = minDeviation(received from api)*-1, similarly minUd = maxDeviation(received from api)*-1
              contUdRows.push({date:currDateStrDDMMYYY, fromTb:contDeviationData.udListObj[i].fromTb, toTb:contDeviationData.udListObj[i].toTb, avgUd:contDeviationData.udListObj[i].avgDeviation*-1, maxUd:contDeviationData.udListObj[i].minDeviation*-1, minUd:contDeviationData.udListObj[i].maxDeviation*-1 })
            }
              
          }catch(err){
            errorDiv.classList.add("mt-4", "mb-4", "alert", "alert-danger")
            errorDiv.innerHTML = `<b>Oops !!! Data Fetch Unsuccessful For ${selectedStateList[stateInd].value} For ${datesChunksList[ind].startTime.substring(0,10)}. Please Try Again</b>`
            console.log(err)
          }
            
        }//For loop end
         //generating column name
        const contOdTblCols = [{ title: 'Date', data:"date" },{ title: 'From_TB', data:"fromTb" }, { title: 'To_TB' , data:"toTb" }, { title: 'Avg_OD', data:"avgOd" }, { title: 'Max_OD', data:"maxOd"}, { title: 'Min_OD', data:"minOd"}]
        const contUdTblCols = [{ title: 'Date', data:"date" },{ title: 'From_TB', data:"fromTb" }, { title: 'To_TB' , data:"toTb" }, { title: 'Avg_UD', data:"avgUd" }, { title: 'Max_UD', data:"maxUd"}, { title: 'Min_UD', data:"minUd"}]
        
        //draw table instantaneous max ui and corresponding shcedule and actual
        $(`#${selectedStateList[stateInd].name}_contOdTbl`).DataTable({
          dom: "Brtp",
          autoWidth: false,
          // autoHeight:false,
          lengthMenu: [50, 192, 188],
          data: contOdRows,
          columns: contOdTblCols
          });

          //draw table net ui and net shcedule and actual
        $(`#${selectedStateList[stateInd].name}_contUdTbl`).DataTable({
          dom: "Brtp",
          autoWidth: false,
          lengthMenu: [50, 192, 188],
          data: contUdRows,
          columns: contUdTblCols
          })
      }
      catch(err){
        errorDiv.classList.add("mt-4", "mb-4", "alert", "alert-danger")
        errorDiv.innerHTML = `<b>Oops !!! Data Fetch Unsuccessful For ${selectedStateList[stateInd].value} B/w Selected Date. Please Try Again</b>`
        console.log(err)
      }
    }      
    spinnerDiv.classList.remove("loader")  
    }
}