import {fetchTableData} from "./fetchTableData"
import {fetchPlotData} from "./fetchPlotData"
declare var Choices: any;


export interface odUdRespObj {
  odUdData:[Date|string, number, number, number, number, number,number,number][]
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

  const plotSectionDiv = document.getElementById("odUdPlotSection") as HTMLDivElement
  const tblSectionDiv = document.getElementById("odUdTableSection") as HTMLDivElement

  tblIconBtn.classList.add("tblActive")
  plotSectionDiv.hidden =true

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
