import {SelectedStateObj} from "./odUdUiIndex"
import {getOdUdData} from "../fetchDataApi"

export const fetchTableData = async () => {
    //to display error msg
    const errorDiv = document.getElementById("errorTableDiv") as HTMLDivElement;
  
    //to display spinner
    const spinnerDiv = document.getElementById("tableSpinner") as HTMLDivElement;
  
    //to display spinner
    const odUdDataTableWrapper = document.getElementById("odUdTableWrapper") as HTMLDivElement;
  
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

      //to keep track of current state in loop 
       let currState = ""

      //adding spinner class to spinner div
      spinnerDiv.classList.add("loader");
    
      for (let stateInd = 0; stateInd < selectedStateList.length; stateInd++) {
        try{
        currState = selectedStateList[stateInd].value

        // div for meta info like showing table of which state and date
        let metaInfoDiv = document.createElement("div");
        metaInfoDiv.className = " text-info text-center mt-3 mb-5 font-weight-bold h5";
        odUdDataTableWrapper.appendChild(metaInfoDiv);

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
  
        //fetch data for each states and push data to datatble div created above dynamically
        let odUdData = await getOdUdData(startDateValue, endDateValue, selectedStateList[stateInd].value)
  
        //generating column name
        const columns = [{ title: 'Date_Key' }, { title: `${selectedStateList[stateInd].name}_Sch_Drawl` }, { title: `${selectedStateList[stateInd].name}_Act_Drawl` }, { title: `${selectedStateList[stateInd].name}_Deviation` },{ title: `${selectedStateList[stateInd].name}_Shortage` }, { title: `${selectedStateList[stateInd].name}_Consumption` }, { title: `${selectedStateList[stateInd].name}_Availability` }, { title: `${selectedStateList[stateInd].name}_Requirement` }]
  
        $(`#${selectedStateList[stateInd].name}_tbl`).DataTable({
          dom: "Bfrtip",
          lengthMenu: [50, 192, 188],
          data: odUdData.odUdData,
          columns: columns
      });
      // showing meta information
      metaInfoDiv.innerHTML =  `Showing Schedule Drawal, Actual Drawal and Deviation(in MUs) For State ${selectedStateList[stateInd].value}.`
      }catch(err){
        errorDiv.classList.add("mt-4", "mb-4", "alert", "alert-danger")
        errorDiv.innerHTML = `<b>Oops !!! Data Fetch Unsuccessful For ${currState} B/w Selected Date. Please Try Again</b>`
      console.log(err)
      // removing spinner class to spinner div
      spinnerDiv.classList.remove("loader")
          }           
    } 
      //removing spinnner
      spinnerDiv.classList.remove("loader")
  
    }
  };