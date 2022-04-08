import {fetchReportHtml} from "./fetchReportHtml"
// declare var jsPDF: any;
declare var googoose: any;


window.onload = async () => {
    
    const yesterday = ( d => new Date(d.setDate(d.getDate()-1)) )(new Date).toISOString().slice(0,10);
  
    //setting startdate and enddate to yesterday
    const targetDate =document.getElementById("targetDate") as HTMLInputElement
    targetDate.value= yesterday;
    targetDate.setAttribute("max", yesterday);  

    // adding onclick listener on submit btn  
    const submitBtn = document.getElementById("submitBtn") as HTMLButtonElement
    submitBtn.onclick= wrapperFunc;

    // adding onclick listener on pdf Convert  btn
    const pdfConvBtn = document.getElementById("convertPdfBtn") as HTMLButtonElement
    pdfConvBtn.onclick= Export2Pdf;    
  };
 
  const wrapperFunc = async ()=>{
      const submitBtn = document.getElementById("submitBtn") as HTMLButtonElement 
      submitBtn.disabled = true
      submitBtn.classList.add("button", "disabled");
      await fetchReportHtml() 
      submitBtn.disabled = false
      submitBtn.classList.remove("button", "disabled");
  }

  function Export2Pdf(){
    window.print()
}