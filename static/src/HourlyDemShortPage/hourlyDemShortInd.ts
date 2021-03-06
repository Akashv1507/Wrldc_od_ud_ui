import {fetchHourlyDemShortTblData} from "./fetchHourlyDemShortTblData"
declare var Choices: any;

window.onload = async () => {
  
  const yesterday = ( d => new Date(d.setDate(d.getDate()-1)) )(new Date).toISOString().slice(0,10);

  //setting startdate and enddate to yesterday
  (document.getElementById("startDate") as HTMLInputElement).value= yesterday;
  (document.getElementById("endDate") as HTMLInputElement).value = yesterday;

  // getting right arrow btn and left arrow btn
  (document.getElementById("leftArrow") as HTMLButtonElement).onclick = setPrevDate;
  (document.getElementById("rightArrow") as HTMLButtonElement).onclick = setNextDate;
    
  const submitBtn = document.getElementById("submitBtn") as HTMLButtonElement
  submitBtn.onclick= wrapperFunc;
};

const wrapperFunc = async ()=>{
  const submitBtn = document.getElementById("submitBtn") as HTMLButtonElement 
  const leftArrowBtn = document.getElementById("leftArrow") as HTMLButtonElement 
  const rightArrowBtn = document.getElementById("rightArrow") as HTMLButtonElement 

     // making submit button disabled till api call fetches data
     submitBtn.disabled = true
     leftArrowBtn.disabled = true
     rightArrowBtn.disabled = true

     submitBtn.classList.add("button", "disabled")
     leftArrowBtn.classList.add("button", "disabled")
     rightArrowBtn.classList.add("button", "disabled")

     fetchHourlyDemShortTblData()
     
     submitBtn.disabled = false
     leftArrowBtn.disabled = false
     rightArrowBtn.disabled = false

     leftArrowBtn.classList.remove("button", "disabled")
     rightArrowBtn.classList.remove  ("button", "disabled")
     submitBtn.classList.remove("button", "disabled");
}

const setPrevDate = ()=>{
  
  //return in string
  let startDate=(document.getElementById("startDate") as HTMLInputElement)

  //converting to date obj, then subtracting one day then setting to startdate and endDate value and calling both the functions
  const startDateObj = new Date (startDate.value)
  
  let newStartDate= startDateObj.setDate(startDateObj.getDate()-1)
  startDate.value = (new Date(newStartDate)).toISOString().slice(0,10)

  //calling both the function with the new start date and end date
  wrapperFunc()
}

const setNextDate = ()=>{
  //return in string
  let endDate = (document.getElementById("endDate") as HTMLInputElement)

  //converting to date obj, then subtracting one day then setting to startdate and endDate value and calling both the functions
  const endDateObj = new Date (endDate.value)

  let newEndDate= endDateObj.setDate(endDateObj.getDate()+1)
  endDate.value  = (new Date(newEndDate)).toISOString().slice(0,10)
  
  //calling both the function with the new start date and end date
 wrapperFunc()
}

