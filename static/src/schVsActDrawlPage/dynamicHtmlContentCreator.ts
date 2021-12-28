export const createDynamicHtmlContent = (stateName:string, stateValue:string, schVsActDrawlTableWrapper:HTMLDivElement)=>{
    

     // div that holds two max ui and min table div
     let maxMinUiTblsDiv = document.createElement("div");
     maxMinUiTblsDiv.className = "row justify-content-between";
     schVsActDrawlTableWrapper.appendChild(maxMinUiTblsDiv);
     
    //  ------------max ui tbl div and its children-----------------
     // instantaneous max ui div
     let maxTblDiv = document.createElement("div");
     maxTblDiv.className = "col-md-5";
     maxMinUiTblsDiv.appendChild(maxTblDiv);

     // div for meta info 
     let maxTblInfoDiv = document.createElement("div");
     maxTblInfoDiv.className = " text-info text-center mt-3 mb-2 font-weight-bold";
     maxTblInfoDiv.innerHTML = "<u>Instantaneous Max UI(OD) and Corresponding Schedule and Actual(MW)</u>"
     maxTblDiv.appendChild(maxTblInfoDiv);
    
     // instantaneous max ui table
     let maxUiTbl = document.createElement('table');
     maxUiTbl.className = "table table-bordered table-hover display "
     maxUiTbl.id = `${stateName}_maxUiTbl`;
     maxTblDiv.appendChild(maxUiTbl);

     //  ------------min ui tbl div and its children-----------------
     // instantaneous min ui div
     let minTblDiv = document.createElement("div");
     minTblDiv.className = "col-md-5";
     maxMinUiTblsDiv.appendChild(minTblDiv);
    
     // div for meta info 
     let minTblInfoDiv = document.createElement("div");
     minTblInfoDiv.className = " text-info text-center mt-3 mb-2 font-weight-bold";
     minTblInfoDiv.innerHTML = "<u>Instantaneous Min UI(UD) and Corresponding Schedule and Actual(MW)</u>"
     minTblDiv.appendChild(minTblInfoDiv);

     // instantaneous min ui table
     let minUiTbl = document.createElement('table');
     minUiTbl.className = "table table-bordered table-hover display"
     minUiTbl.id = `${stateName}_minUiTbl`;
     minTblDiv.appendChild(minUiTbl);
     
     //------------------------now avg od ud tbl start-------------------------

     // div that holds two avg od ud table div
     let avgOdUdTblsDiv = document.createElement("div");
     avgOdUdTblsDiv.className = "row justify-content-between";
     schVsActDrawlTableWrapper.appendChild(avgOdUdTblsDiv);
    
    // -------- avg od tble and children------------- 
     // avg od tbl div 
     let avgOdTblDiv = document.createElement("div");
     avgOdTblDiv.className = "col-md-5";
     avgOdUdTblsDiv.appendChild(avgOdTblDiv);
    
     // div for meta info 
     let avgOdTblInfoDiv = document.createElement("div");
     avgOdTblInfoDiv.className = " text-info text-center mt-3 mb-2 font-weight-bold";
     avgOdTblInfoDiv.innerHTML = " <u>Avg OD and Corresponding Avg Schedule and Actual(MW)</u>"
     avgOdTblDiv.appendChild(avgOdTblInfoDiv);

     // avg od tbl
     let avgOdTbl = document.createElement('table');
     avgOdTbl.className = "table table-bordered table-hover display "
     avgOdTbl.id = `${stateName}_avgOdTbl`;
     avgOdTblDiv.appendChild(avgOdTbl);

     //---------------------avg ud table and its children
     // avg ud tbl div
     let avgUdTblDiv = document.createElement("div");
     avgUdTblDiv.className = "col-md-5";
     avgOdUdTblsDiv.appendChild(avgUdTblDiv);
 
    // div for meta info
    let avgudTblInfoDiv = document.createElement("div");
    avgudTblInfoDiv.className = " text-info text-center mt-3 mb-2 font-weight-bold";
    avgudTblInfoDiv.innerHTML = " <u>Avg UD and Corresponding Avg Schedule and Actual(MW)</u>"
    avgUdTblDiv.appendChild(avgudTblInfoDiv);
    
     // avg ud tbl
     let avgUdTbl = document.createElement('table');
     avgUdTbl.className = "table table-bordered table-hover display"
     avgUdTbl.id = `${stateName}_avgUdTbl`;
     avgUdTblDiv.appendChild(avgUdTbl);
     
     // div for plotting horizontal rule
     let hrDiv = document.createElement("div");
     hrDiv.className = "hrStyle mt-3 mb-3";
     schVsActDrawlTableWrapper.appendChild(hrDiv);
}