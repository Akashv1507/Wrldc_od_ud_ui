export const createDevTblDynamicHtml = (stateName:string, contDeviationTableWrapper:HTMLDivElement)=>{
    

     // div that holds two continuous OD and continuous UD table div
     let conDevTblsDiv = document.createElement("div");
     conDevTblsDiv.className = "row justify-content-between";
     contDeviationTableWrapper.appendChild(conDevTblsDiv);
     
    //  ------------continuous OD tbl div and its children-----------------
     // continuous OD div
     let contOdTblDiv = document.createElement("div");
     contOdTblDiv.className = "col-md-6";
     conDevTblsDiv.appendChild(contOdTblDiv);

     // div for meta info 
     let contOdTblInfoDiv = document.createElement("div");
     contOdTblInfoDiv.className = " text-info text-center mt-3 mb-2 font-weight-bold";
     contOdTblInfoDiv.innerHTML = "<u>Avg OD, Min Od, Max OD b/w Continuous Time Blocks</u>"
     contOdTblDiv.appendChild(contOdTblInfoDiv);
    
     // continuous OD table
     let contOdTbl = document.createElement('table');
     contOdTbl.className = "table table-bordered table-hover display "
     contOdTbl.id = `${stateName}_contOdTbl`;
     contOdTblDiv.appendChild(contOdTbl);

     //  ------------continuous UD tbl div and its children-----------------
     // continuous UD tbl div
     let contUdDiv = document.createElement("div");
     contUdDiv.className = "col-md-6";
     conDevTblsDiv.appendChild(contUdDiv);
    
     // div for meta info 
     let contUdTblInfoDiv = document.createElement("div");
     contUdTblInfoDiv.className = " text-info text-center mt-3 mb-2 font-weight-bold";
     contUdTblInfoDiv.innerHTML = "<u>Avg UD, Min Ud, Max UD b/w Continuous Time Blocks</u>"
     contUdDiv.appendChild(contUdTblInfoDiv);

     // continuous UD table
     let contUdTbl = document.createElement('table');
     contUdTbl.className = "table table-bordered table-hover display"
     contUdTbl.id = `${stateName}_contUdTbl`;
     contUdDiv.appendChild(contUdTbl);

      // div for plotting horizontal rule
      let hrDiv = document.createElement("div");
      hrDiv.className = "hrStyle mt-3 mb-3";
      contDeviationTableWrapper.appendChild(hrDiv);
}