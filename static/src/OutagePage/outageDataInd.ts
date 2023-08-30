import {fetchOutageData} from "./fetchOutageData"

window.onload = async () => {
  
  let currDate = new Date();
  let yesterdayDate = new Date(currDate.setDate(currDate.getDate()-1));
  let yesterdayDateStr = yesterdayDate.toISOString().substring(0,10);

  //setting target date to yesterday
  (document.getElementById("targetDate") as HTMLInputElement).value=  yesterdayDateStr + 'T00:00';
 

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

     fetchOutageData()
     
     submitBtn.disabled = false
     leftArrowBtn.disabled = false
     rightArrowBtn.disabled = false

     leftArrowBtn.classList.remove("button", "disabled")
     rightArrowBtn.classList.remove  ("button", "disabled")
     submitBtn.classList.remove("button", "disabled");
}

const setPrevDate = ()=>{
  
  //return in string
  let targetDate=(document.getElementById("targetDate") as HTMLInputElement)

  //converting to date obj, then subtracting one day then setting to targetDate and calling functions
  const targetDateObj = new Date (targetDate.value)
  // toISOString() will subtract 5 hours and 30 minutes, hence adding 5 hours and 30 minutes before converting to string
  targetDateObj.setHours(targetDateObj.getHours()+5, targetDateObj.getMinutes()+30)
  let newTargetDate= targetDateObj.setDate(targetDateObj.getDate()-1)
  targetDate.value = (new Date(newTargetDate)).toISOString().slice(0,16)

  //calling function with the new targetDate
  wrapperFunc()
}

const setNextDate = ()=>{
  //return in string
  let targetDate=(document.getElementById("targetDate") as HTMLInputElement)

  //converting to date obj, then subtracting one day then setting to targetDate and calling functions
  const targetDateObj = new Date (targetDate.value)
  // toISOString() will subtract 5 hours and 30 minutes, hence adding 5 hours and 30 minutes before converting to string
  targetDateObj.setHours(targetDateObj.getHours()+5, targetDateObj.getMinutes()+30)
  let newTargetDate= targetDateObj.setDate(targetDateObj.getDate()+1)
  targetDate.value = (new Date(newTargetDate)).toISOString().slice(0,16)

  //calling function with the new targetDate
  wrapperFunc()
}

