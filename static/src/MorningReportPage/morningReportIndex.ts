import {fetchReportHtml} from "./fetchReportHtml"


window.onload = async () => {
    
    const yesterday = ( d => new Date(d.setDate(d.getDate()-1)) )(new Date).toISOString().slice(0,10);
  
    //setting startdate and enddate to yesterday
    const targetDate =document.getElementById("targetDate") as HTMLInputElement
    targetDate.value= yesterday;
    targetDate.setAttribute("max", yesterday);
    // getting right arrow btn and left arrow btn
    // (document.getElementById("leftArrow") as HTMLButtonElement).onclick = setPrevDate;
    // (document.getElementById("rightArrow") as HTMLButtonElement).onclick = setNextDate;
      
    const submitBtn = document.getElementById("submitBtn") as HTMLButtonElement
    submitBtn.onclick= wrapperFunc;
    
  };

  const setPrevDate = ()=>{
  
    //return in string
    let targetDate=(document.getElementById("targetDate") as HTMLInputElement)
  
    //converting to date obj, then subtracting one day then setting to target date
    const targetDateObj = new Date (targetDate.value)
  
    let newtargetDateObj= targetDateObj.setDate(targetDateObj.getDate()-1)
    targetDate.value = (new Date(newtargetDateObj)).toISOString().slice(0,10)
  
    wrapperFunc()
  }

  const setNextDate = ()=>{
    //return in string
    let targetDate=(document.getElementById("targetDate") as HTMLInputElement)
  
    //converting to date obj, then subtracting one day then setting to target date
    const targetDateObj = new Date (targetDate.value)
  
    let newtargetDateObj= targetDateObj.setDate(targetDateObj.getDate()+1)
    targetDate.value = (new Date(newtargetDateObj)).toISOString().slice(0,10)
  
    wrapperFunc()
  }
  
  const wrapperFunc = async ()=>{
    const submitBtn = document.getElementById("submitBtn") as HTMLButtonElement 
    // const leftArrowBtn = document.getElementById("leftArrow") as HTMLButtonElement 
    // const rightArrowBtn = document.getElementById("rightArrow") as HTMLButtonElement 
  
       // making submit button disabled till api call fetches data
       submitBtn.disabled = true
      //  leftArrowBtn.disabled = true
      //  rightArrowBtn.disabled = true
  
       submitBtn.classList.add("button", "disabled");
      //  leftArrowBtn.classList.add("button", "disabled");
      //  rightArrowBtn.classList.add("button", "disabled");

      await fetchReportHtml()
       
       submitBtn.disabled = false
      //  leftArrowBtn.disabled = false
      //  rightArrowBtn.disabled = false
  
      //  leftArrowBtn.classList.remove("button", "disabled")
      //  rightArrowBtn.classList.remove  ("button", "disabled")
       submitBtn.classList.remove("button", "disabled");
  }