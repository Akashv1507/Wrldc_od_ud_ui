import {getReportHtmlContent} from "../fetchDataApi"

export const fetchReportHtml = async()=>{
   
    //to display error msg
    const errorDiv = document.getElementById("errorContDevTableDiv") as HTMLDivElement;
  
    //to display spinner
    const spinnerDiv = document.getElementById("contDeviationTableSpinner") as HTMLDivElement;
  
    const reportSectionDiv = document.getElementById("reportSection") as HTMLDivElement;
  
    //get user inputs
    let targetDateValue = (
      document.getElementById("targetDate") as HTMLInputElement
    ).value;

    const htmlText = await getReportHtmlContent(targetDateValue)
    reportSectionDiv.innerHTML = htmlText

      
}