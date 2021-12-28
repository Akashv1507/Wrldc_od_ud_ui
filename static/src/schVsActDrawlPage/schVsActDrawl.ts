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

  const yesterday = ( d => new Date(d.setDate(d.getDate()-1)) )(new Date).toISOString().slice(0,10);

  //setting startdate and enddate to yesterday
  (document.getElementById("startDate") as HTMLInputElement).value= yesterday;
  (document.getElementById("endDate") as HTMLInputElement).value = yesterday;

  // getting right arrow btn and left arrow btn
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
    fetchPlotData()
    fetchTableData()   
}

const setPrevDate = ()=>{
  
  // console.log(this.id)
  //return in string
  let startDate=(document.getElementById("startDate") as HTMLInputElement)
  let endDate = (document.getElementById("endDate") as HTMLInputElement)

  //converting to date obj, then subtracting one day then setting to startdate and endDate value and calling both the functions
  const startDateObj = new Date (startDate.value)
  const endDateObj = new Date (endDate.value)

  let newStartDate= startDateObj.setDate(startDateObj.getDate()-1)
  startDate.value = (new Date(newStartDate)).toISOString().slice(0,10)

  let newEndDate= endDateObj.setDate(endDateObj.getDate()-1)
  endDate.value  = (new Date(newEndDate)).toISOString().slice(0,10)
  
  //calling both the function with the new start date and end date
  fetchPlotData()
  fetchTableData()
}

const setNextDate = ()=>{
  //return in string
  let startDate=(document.getElementById("startDate") as HTMLInputElement)
  let endDate = (document.getElementById("endDate") as HTMLInputElement)

  //converting to date obj, then subtracting one day then setting to startdate and endDate value and calling both the functions
  const startDateObj = new Date (startDate.value)
  const endDateObj = new Date (endDate.value)

  let newStartDate= startDateObj.setDate(startDateObj.getDate()+1)
  startDate.value = (new Date(newStartDate)).toISOString().slice(0,10)

  let newEndDate= endDateObj.setDate(endDateObj.getDate()+1)
  endDate.value  = (new Date(newEndDate)).toISOString().slice(0,10)
  
  //calling both the function with the new start date and end date
  fetchPlotData()
  fetchTableData()
}

