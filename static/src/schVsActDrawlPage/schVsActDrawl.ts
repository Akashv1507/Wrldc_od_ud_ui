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


