
import {getHourlyDemShortTbldData} from "../fetchDataApi"


export const fetchHourlyDemShortTblData = async () => {
    //to display error msg
    const errorDiv = document.getElementById("errorDemShortageTableDiv") as HTMLDivElement;
  
    //to display spinner
    const spinnerDiv = document.getElementById("demShortageTblSpinner") as HTMLDivElement;
  
    //to display spinner
    const demShortTblWrapper = document.getElementById("hourlyDemShortageTblWrapper") as HTMLDivElement;
  
    //get user inputs
    let startDateValue = (
      document.getElementById("startDate") as HTMLInputElement
    ).value;
    let endDateValue = (document.getElementById("endDate") as HTMLInputElement)
      .value;
  
    // clearing earlier div(except for first api call), here all the datatble in odUdDataTableWrapper, and we are emptying it, hence no need to clear datatable
    demShortTblWrapper.innerHTML = "";
  
    
    //validation checks, and displaying msg in error div
    if (startDateValue === "" || endDateValue === "") {
      errorDiv.classList.add("mt-4", "mb-4", "alert", "alert-danger");
      errorDiv.innerHTML = "<b> Please Enter a Valid Start Date/End Date</b>";
    } else if (startDateValue > endDateValue) {
      errorDiv.classList.add("mt-4", "mb-4", "alert", "alert-danger");
      errorDiv.innerHTML =
        "<b> Ooops !! End Date should be greater or Equal to Start Date </b>";
    } else {
    
      try{
         //if reached this ,means no validation error ,emptying error div and making start date and end date in desired format
         errorDiv.classList.remove("mt-4", "mb-4", "alert", "alert-danger");
         errorDiv.innerHTML = "";
 
         //adding spinner class to spinner div
         spinnerDiv.classList.add("loader");
 
         // div for meta info like showing table of which state and date
         let metaInfoDiv = document.createElement("div");
         metaInfoDiv.className = " text-info text-center mt-3 mb-5 font-weight-bold h5";
         demShortTblWrapper.appendChild(metaInfoDiv);
 
         //defining table schema dynamically
         let tbl = document.createElement('table');
         tbl.style.width = '100px';
         tbl.id = `hourlyDemShort_tbl`;
         tbl.className = "table table-bordered table-hover display w-auto "
         demShortTblWrapper.appendChild(tbl);
   
         //fetch data for each states and push data to datatble div created above dynamically
         let hourlyDemShortList = await getHourlyDemShortTbldData(startDateValue, endDateValue,)
         
         //generating column name
         const cols = [{ title: 'Date', data:"dateKey" },{ title: 'Hour', data:"hour" }, { title: 'Mah_Shedd', data:"MAH_short"  }, { title: 'Guj_Shedd', data:"GUJ_short"}, {title:'MP_Shedd', data:"MP_short"}, {title:'Ch_Shedd', data:"CH_short"}, {title:'Goa_Shedd', data:"GOA_short"}, {title:'DD_Shedd', data:"DD_short"}, {title:'DNH_Shedd', data:"DNH_short"}, { title: 'WR_Shedd', data:"WR_short"  }, { title: 'Mah_Dem' , data:"MAH_dem" }, { title: 'Guj_Dem', data:"GUJ_dem"}, {title:'MP_Dem', data:"MP_dem"}, {title:'Ch_Dem', data:"CH_dem"}, {title:'Goa_Dem', data:"GOA_dem"}, {title:'DD_Dem', data:"DD_dem"}, {title:'DNH_Dem', data:"DNH_dem"}, {title:'DNH_Dem', data:"DNH_dem"}, { title: 'WR_Dem', data:"WR_dem"  }]
         
         $(`#hourlyDemShort_tbl`).DataTable({
           dom: "Bfrtip",
           fixedHeader: true,
           lengthMenu: [50, 192, 188],
           data: hourlyDemShortList,
           columns: cols
          } as DataTables.Settings);
          
          // showing meta information
          metaInfoDiv.innerHTML =  `Showing Hourly Demand and Load Shedding`
      }catch(err){
        errorDiv.classList.add("mt-4", "mb-4", "alert", "alert-danger")
        errorDiv.innerHTML = `<b>Oops !!! Data Fetch Unsuccessful For B/w Selected Date. Please Try Again</b>`
      console.log(err)
      // removing spinner class to spinner div
      spinnerDiv.classList.remove("loader")
          }    
      //removing spinnner
      spinnerDiv.classList.remove("loader")       
    } 
      
  
    };
 