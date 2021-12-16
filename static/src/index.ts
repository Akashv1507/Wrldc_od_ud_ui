import { getOdUdData } from "./fetchDataApi";

declare var Choices: any;
// declare var $:any;

//interface for api response object
export interface odUdRespObj {
  dateKey: number | string;
  drawalSche: number;
  actualDrawal: number;
  ui: number;
  availability: number;
  requirement: number;
  shortage: number;
  consumption: number;
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
  (document.getElementById("submitBtn") as HTMLButtonElement).onclick =
    fetchData;
};

const fetchData = async () => {
  //to display error msg
  const errorDiv = document.getElementById("errorDiv") as HTMLDivElement;

  //to display spinner
  const spinnerDiv = document.getElementById("spinner") as HTMLDivElement;

  //to display spinner
  const odUdDataTableWrapper = document.getElementById("odUdDataTableWrapper") as HTMLDivElement;

  //get user inputs
  let startDateValue = (
    document.getElementById("startDate") as HTMLInputElement
  ).value;
  let endDateValue = (document.getElementById("endDate") as HTMLInputElement)
    .value;

  const stateOptions = (
    document.getElementById("stateName") as HTMLSelectElement
  ).options;

  // clearing earlier div(except for first api call), here all the datatble in odUdDataTableWrapper, and we are emptying it, hence no need to clear datatable
  odUdDataTableWrapper.innerHTML = "";

  let selectedStateList: SelectedStateObj[] = [];
  for (let option of stateOptions) {
    if (option.selected) {
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
    errorDiv.innerHTML = "<b> Please Select State From Dropdown</b>";
  } else if (startDateValue > endDateValue) {
    errorDiv.classList.add("mt-4", "mb-4", "alert", "alert-danger");
    errorDiv.innerHTML =
      "<b> Ooops !! End Date should be greater or Equal to Start Date </b>";
  } else {

    //if reached this ,means no validation error ,emptying error div and making start date and end date in desired format
    errorDiv.classList.remove("mt-4", "mb-4", "alert", "alert-danger");
    errorDiv.innerHTML = "";
    //adding spinner class to spinner div
    spinnerDiv.classList.add("loader");
    for (let stateInd = 0; stateInd < selectedStateList.length; stateInd++) {

      //defining table schema dynamically
      let tbl = document.createElement('table');
      tbl.style.width = '100px';
      tbl.id = `${selectedStateList[stateInd].name}_tbl`;
      tbl.className = "table table-bordered table-hover display w-auto "
      odUdDataTableWrapper.appendChild(tbl);

      // div for plotting horizontal rule
      let hrDiv1 = document.createElement("div");
      hrDiv1.className = "hrStyle mt-3 mb-3";
      odUdDataTableWrapper.appendChild(hrDiv1);


      //fetch data for each generator and push data to datatble created above dynamically
      let odUdData = await getOdUdData(startDateValue, endDateValue, selectedStateList[stateInd].value)

      //generating column name
      const columns = [{ title: 'Date' }, { title: `${selectedStateList[stateInd].name}_Sch_Drawl` }, { title: `${selectedStateList[stateInd].name}_Act_Drawl` }, { title: `${selectedStateList[stateInd].name}_UI` }, { title: `${selectedStateList[stateInd].name}_Availability` }, { title: `${selectedStateList[stateInd].name}_Requirement` }, { title: `${selectedStateList[stateInd].name}_Shortage` }, { title: `${selectedStateList[stateInd].name}_Consumption` }]

      $(`#${selectedStateList[stateInd].name}_tbl`).DataTable({

        dom: "Bfrtip",
        lengthMenu: [50, 192, 188],
        data: odUdData["odUdData"],
        columns: columns
    });
    }

    //removing spinnner
    spinnerDiv.classList.remove("loader")

  }
};
