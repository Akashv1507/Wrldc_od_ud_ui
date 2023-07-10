
import {getOutageData} from "../fetchDataApi"



export const fetchOutageData = async () => {
    //to display error msg
    const errorDiv = document.getElementById("errorOutageDataTblDiv") as HTMLDivElement;
  
    //to display spinner
    const spinnerDiv = document.getElementById("outageDataTblSpinner") as HTMLDivElement;
  
    //to outage table
    const outageTblWrapper = document.getElementById("outageDataTblWrapper") as HTMLDivElement;
  
    //get user inputs
    let targetDateValue = (
      document.getElementById("targetDate") as HTMLInputElement
    ).value;
  
    // clearing earlier div(except for first api call), here all the datatble in outageTblWrapper, and we are emptying it, hence no need to clear datatable
    outageTblWrapper.innerHTML = "";
  
    
    //validation checks, and displaying msg in error div
    if (targetDateValue === "" ) {
      errorDiv.classList.add("mt-4", "mb-4", "alert", "alert-danger");
      errorDiv.innerHTML = "<b> Please Enter a Valid Target Date</b>";
    }else { 
      try{
         //if reached this ,means no validation error ,emptying error div and making start date and end date in desired format
         errorDiv.classList.remove("mt-4", "mb-4", "alert", "alert-danger");
         errorDiv.innerHTML = "";
 
         //adding spinner class to spinner div
         spinnerDiv.classList.add("loader");
 
         // div for meta info like showing table of which state and date
         let metaInfoDiv = document.createElement("div");
         metaInfoDiv.className = " text-info text-center mt-3 mb-5 font-weight-bold h5";
         outageTblWrapper.appendChild(metaInfoDiv);
 
         //defining table schema dynamically
         let tbl = document.createElement('table');
         tbl.style.width = '100px';
         tbl.id = `outage_tbl`;
         tbl.className = "table table-bordered table-hover display w-auto "
         outageTblWrapper.appendChild(tbl);
   
         //fetch outage data and push data to datatble div created above dynamically
         let outageObjList = await getOutageData(targetDateValue)
         
         //generating column name
         const cols = [{ title: 'EleName', data:"elementName" },{ title: 'StateName', data:"stateName" }, { title: 'Owners', data:"owners"  }, 
         { title: 'StationName', data:"stationName"},{ title: 'StationType', data:"stationType"}, {title:'Unit', data:"unitNo"}, {title:'InstCap', data:"installedCap"}, 
         {title:'Classification', data:"classification"}, {title:'OutageDate', data:"outageDate"}, {title:'OutageTime', data:"outageTime"}, 
         { title: 'ExpDate', data:"expectedDate"  }, { title: 'ExpTime' , data:"expectedTime" }, { title: 'ShutdownType', data:"shutdownType"}, 
         {title:'ShutdownTag', data:"shutdownTag"}, {title:'Reason', data:"reason"}]
         
        $("#outage_tbl").append('<tfoot><tr><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr></tfoot>');
        $(`#outage_tbl`).DataTable({
          
          dom:  'PBfrtip', 
          lengthMenu: [50, 192, 188],
          order: [[1, 'desc']],
          data: outageObjList,
          columns: cols,
          fixedHeader: true,
          searchPanes: {
            initCollapsed: true,
            layout: 'columns-6'
                        },            
        footerCallback: function (row, data, start, end, display) {
          let api = this.api();
    
          // Total over all pages
          const total = api
              .column(6)
              .data()
              .reduce((a, b) =>a + b, 0);
    
          // Total over this page
          const pageTotal = api
              .column(6, { page: 'current' })
              .data()
              .reduce((a, b) => a + b, 0);

          const roundInstCapcityOutTotal= Math.round(pageTotal)
         
          // Update footer
          $(api.column(0).footer()).html("Total InstCapacity Out");
          $(api.column(6).footer()).html(`${roundInstCapcityOutTotal}`)

      }
        } as DataTables.Settings);
          // showing meta information
          metaInfoDiv.innerHTML =  `Showing Latest Generator Outage Data.`
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
 