import{SelectedStateObj} from "./schVsActDrawl"
import { getFreqAndCorrDevData } from "../fetchDataApi";
import {createWrTblDynamicHtml} from "./wrTblDynamicHtmlCreator"
import {yyyyddmmToddmmyyy, convertIsoString, getListOfDates} from  "../timeUtils"


export interface IFreqAndCorrDev{
  date:string
  time:string
  freq:number
  Mah_dev:number
  Guj_dev:number
  MP_dev:number
  Chatt_dev:number
  Goa_dev:number
  DD_dev:number
  DNH_dev:number
} 
export interface IRespFreqAndCorrDev{
  maxFreqAndCorrDev:IFreqAndCorrDev
  minFreqAndCorrDev:IFreqAndCorrDev
} 


export const fetchDFreqAndCorrTableData = async()=>{
   
    //to display error msg
    const errorDiv = document.getElementById("errorWrTableDiv") as HTMLDivElement;
  
    //to display spinner
    const spinnerDiv = document.getElementById("wrTableSpinner") as HTMLDivElement;
  
    //to display tables
    const wrTableWrapper = document.getElementById("wrTableWrapper") as HTMLDivElement;
  
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
    wrTableWrapper.innerHTML = "";
  
    let selectedStateList: SelectedStateObj[] = [];
    for (let option of stateOptions) {
      if (option.selected && option.value=="WR") {
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
      errorDiv.innerHTML = "<b> Please Select WR From Dropdown</b>";
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
  
    try{
        // to store all max/min freq and correponding deviation rows of table
        let maxFreqAndCorrDevList:IFreqAndCorrDev[] = []
        let minFreqAndCorrDevList:IFreqAndCorrDev[] = []

        // div for meta info like showing table of which state
        let stateInfoDIv = document.createElement("div");
        stateInfoDIv.className = " text-danger text-center mt-3 mb-2 font-weight-bold h4";
        stateInfoDIv.innerHTML = `Tables- All States Deviation Corresponding to Max and Min Frequency.`
        wrTableWrapper.appendChild(stateInfoDIv);

        //creating dynamic html div and tables
        createWrTblDynamicHtml(wrTableWrapper)

       //fetch data for each states and for each date, cal min max avg for each day and append to list
       for(let ind=0;ind<datesChunksList.length;ind++){
          try{
            
            //let currDateStrDDMMYYY = yyyyddmmToddmmyyy(datesChunksList[ind].startTime)
            //making api call
            const maxMinFreqAndCorrDev = await getFreqAndCorrDevData(datesChunksList[ind].startTime, datesChunksList[ind].endTime)
            maxFreqAndCorrDevList.push(maxMinFreqAndCorrDev.maxFreqAndCorrDev) 
            minFreqAndCorrDevList.push(maxMinFreqAndCorrDev.minFreqAndCorrDev)
              
          }catch(err){
            errorDiv.classList.add("mt-4", "mb-4", "alert", "alert-danger")
            errorDiv.innerHTML = `<b>Oops !!! Data Fetch Unsuccessful For ${datesChunksList[ind].startTime.substring(0,10)}. Please Try Again</b>`
            console.log(err)
          }
            
        }//For loop end
         //generating column name
        const maxFreqAndCorrDevCols = [{ title: 'Date', data:"date" },{ title: 'Max-Freq', data:"freq" }, { title: 'Time-Max-Freq' , data:"time" }, { title: 'Mah-Dev', data:"mahDev" }, { title: 'Guj-Dev', data:"gujDev"}, { title: 'MP-Dev', data:"mpDev"}, { title: 'Chatt-Dev', data:"chattDev" }, { title: 'Goa-Dev', data:"goaDev"}, { title: 'DD-Dev', data:"ddDev"}, { title: 'DNH-Dev', data:"dnhDev"}]
        const minFreqAndCorrDevCols = [{ title: 'Date', data:"date" },{ title: 'Min-Freq', data:"freq" }, { title: 'Time-Min-Freq' , data:"time" }, { title: 'Mah-Dev', data:"mahDev" }, { title: 'Guj-Dev', data:"gujDev"}, { title: 'MP-Dev', data:"mpDev"}, { title: 'Chatt-Dev', data:"chattDev" }, { title: 'Goa-Dev', data:"goaDev"}, { title: 'DD-Dev', data:"ddDev"}, { title: 'DNH-Dev', data:"dnhDev"}]
        
        //draw table instantaneous max ui and corresponding shcedule and actual
        $(`#wr_max_freq`).DataTable({
          dom: "Brtp",
          autoWidth: false,
          // autoHeight:false,
          lengthMenu: [50, 192, 188],
          data: maxFreqAndCorrDevList,
          columns: maxFreqAndCorrDevCols
          });

          //draw table net ui and net shcedule and actual
        $(`#wr_min_freq`).DataTable({
          dom: "Brtp",
          autoWidth: false,
          lengthMenu: [50, 192, 188],
          data: minFreqAndCorrDevList,
          columns: minFreqAndCorrDevCols
          })
      }
      catch(err){
        errorDiv.classList.add("mt-4", "mb-4", "alert", "alert-danger")
        errorDiv.innerHTML = `<b>Oops !!! Data Fetch Unsuccessful B/w Selected Date. Please Try Again</b>`
        console.log(err)
      }
          
    spinnerDiv.classList.remove("loader")  
    }
}