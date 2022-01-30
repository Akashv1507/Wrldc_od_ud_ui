import {fetchPlotData} from "./fetchPlotData"
import {fetchTableData} from "./fetchTableData"

declare var Choices: any;
// declare var $:any;

//interface for api response object
export interface schActDrawlResObj {
  // here date in string formate
  schVsActDrawlData: [string,number][];
}

export interface SelectedStateObj {
name: string;
value: string;
}

let intervalID = null;
window.onload = async () => {
  //providing multiple selection options
  var multipleCancelButton = new Choices("#stateName", {
    removeItemButton: true,
    maxItemCount: 50,
    searchResultLimit: 50,
    renderChoiceLimit: 50,
  });
  let currDate = new Date();
  let yesterdayDate = new Date(currDate.setDate(currDate.getDate()-1));
  let yesterdayDateStr = yesterdayDate.toISOString().substring(0,10);

  //setting startdate and enddate to yesterday
  (document.getElementById("startDate") as HTMLInputElement).value= yesterdayDateStr + 'T00:00';
  (document.getElementById("endDate") as HTMLInputElement).value = yesterdayDateStr +'T23:59';

  // getting right arrow btn and left arrow b
  (document.getElementById("leftArrow") as HTMLButtonElement).onclick = setPrevDate;
  (document.getElementById("rightArrow") as HTMLButtonElement).onclick = setNextDate;
  
  const submitBtn = document.getElementById("submitBtn") as HTMLButtonElement
  submitBtn.onclick= wrapperFunc;

  const tblIconBtn = document.getElementById("tblIcon") as HTMLButtonElement
  const chartIconBtn = document.getElementById("chartIcon") as HTMLButtonElement

  const plotSectionDiv = document.getElementById("schVsActDrawlPlotSection") as HTMLDivElement
  const tblSectionDiv = document.getElementById("schVsActDrawlTableSection") as HTMLDivElement

 
  chartIconBtn.classList.add("chartActive")
  tblSectionDiv.hidden =true

  tblIconBtn.onclick = ()=>{
    tblIconBtn.classList.add("tblActive")
    chartIconBtn.classList.remove("chartActive")

    tblSectionDiv.hidden =false
    plotSectionDiv.hidden = true
  }

  chartIconBtn.onclick = ()=>{
    chartIconBtn.classList.add("chartActive")
    tblIconBtn.classList.remove("tblActive")

    tblSectionDiv.hidden =true
    plotSectionDiv.hidden = false
  }

};

const wrapperFunc = async ()=>{
     const submitBtn = document.getElementById("submitBtn") as HTMLButtonElement 

     // making submit button disabled till api call fetches data
     submitBtn.disabled = true
     submitBtn.classList.add("button", "disabled")
     await fetchPlotData()
     await fetchTableData()   
     submitBtn.disabled = false
     submitBtn.classList.remove("button", "disabled");
}

const setPrevDate = ()=>{
  
  
  //return in string
  let startDate=(document.getElementById("startDate") as HTMLInputElement)
  let endDate = (document.getElementById("endDate") as HTMLInputElement)

  //converting to date obj, then subtracting one day then setting to startdate and endDate value and calling both the functions
  const startDateObj = new Date (startDate.value)
  const endDateObj = new Date (endDate.value)

  // toISOString() will subtract 5 hours and 30 minutes, hence adding 5 hours and 30 minutes before converting to string
  startDateObj.setHours(startDateObj.getHours()+5, startDateObj.getMinutes()+30)
  endDateObj.setHours(endDateObj.getHours()+5, endDateObj.getMinutes()+30)

  let newStartDate= startDateObj.setDate(startDateObj.getDate()-1)
  startDate.value = (new Date(newStartDate)).toISOString().slice(0,16)

  let newEndDate= endDateObj.setDate(endDateObj.getDate()-1)
  endDate.value  = (new Date(newEndDate)).toISOString().slice(0,16)
  
  //calling both the function with the new start date and end date
  // fetchPlotData()
  // fetchTableData()
  wrapperFunc()
}

const setNextDate = ()=>{
  //return in string
  let startDate=(document.getElementById("startDate") as HTMLInputElement)
  let endDate = (document.getElementById("endDate") as HTMLInputElement)

  //converting to date obj, then subtracting one day then setting to startdate and endDate value and calling both the functions
  const startDateObj = new Date (startDate.value)
  const endDateObj = new Date (endDate.value)

  // toISOString() will subtract 5 hours and 30 minutes, hence adding 5 hours and 30 minutes before converting to string
  startDateObj.setHours(startDateObj.getHours()+5, startDateObj.getMinutes()+30)
  endDateObj.setHours(endDateObj.getHours()+5, endDateObj.getMinutes()+30)
  
  let newStartDate= startDateObj.setDate(startDateObj.getDate()+1)
  startDate.value = (new Date(newStartDate)).toISOString().slice(0,16)

  let newEndDate= endDateObj.setDate(endDateObj.getDate()+1)
  endDate.value  = (new Date(newEndDate)).toISOString().slice(0,16)
  
  //calling both the function with the new start date and end date
  // fetchPlotData()
  // fetchTableData()
  wrapperFunc()
}

