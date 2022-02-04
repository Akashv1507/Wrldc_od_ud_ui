// export const createDynamicHtmlContent = (stateName:string, stateValue:string, schVsActDrawlTableWrapper:HTMLDivElement)=>{
    

//      // div that holds two max ui and min table div
//      let maxMinUiTblsDiv = document.createElement("div");
//      maxMinUiTblsDiv.className = "row justify-content-between";
//      schVsActDrawlTableWrapper.appendChild(maxMinUiTblsDiv);
     
//     //  ------------max ui tbl div and its children-----------------
//      // instantaneous max ui div
//      let maxTblDiv = document.createElement("div");
//      maxTblDiv.className = "col-md-5";
//      maxMinUiTblsDiv.appendChild(maxTblDiv);

//      // div for meta info 
//      let maxTblInfoDiv = document.createElement("div");
//      maxTblInfoDiv.className = " text-info text-center mt-3 mb-2 font-weight-bold";
//      maxTblInfoDiv.innerHTML = "<u>Instantaneous Max OD & Corresponding Schedule, Actual(MW) & Frequency</u>"
//      maxTblDiv.appendChild(maxTblInfoDiv);
    
//      // instantaneous max ui table
//      let maxUiTbl = document.createElement('table');
//      maxUiTbl.className = "table table-bordered table-hover display "
//      maxUiTbl.id = `${stateName}_maxUiTbl`;
//      maxTblDiv.appendChild(maxUiTbl);

//      //  ------------min ui tbl div and its children-----------------
//      // instantaneous min ui div
//      let minTblDiv = document.createElement("div");
//      minTblDiv.className = "col-md-5";
//      maxMinUiTblsDiv.appendChild(minTblDiv);
    
//      // div for meta info 
//      let minTblInfoDiv = document.createElement("div");
//      minTblInfoDiv.className = " text-info text-center mt-3 mb-2 font-weight-bold";
//      minTblInfoDiv.innerHTML = "<u>Instantaneous Max UD & Corresponding Schedule, Actual(MW) & Frequency</u>"
//      minTblDiv.appendChild(minTblInfoDiv);

//      // instantaneous min ui table
//      let minUiTbl = document.createElement('table');
//      minUiTbl.className = "table table-bordered table-hover display"
//      minUiTbl.id = `${stateName}_minUiTbl`;
//      minTblDiv.appendChild(minUiTbl);
     
//      //------------------------now avg od ud tbl start-------------------------

//      // div that holds two avg od ud table div
//      let avgOdUdTblsDiv = document.createElement("div");
//      avgOdUdTblsDiv.className = "row justify-content-between";
//      schVsActDrawlTableWrapper.appendChild(avgOdUdTblsDiv);
    
//     // -------- avg od tble and children------------- 
//      // avg od tbl div 
//      let avgOdTblDiv = document.createElement("div");
//      avgOdTblDiv.className = "col-md-5";
//      avgOdUdTblsDiv.appendChild(avgOdTblDiv);
    
//      // div for meta info 
//      let avgOdTblInfoDiv = document.createElement("div");
//      avgOdTblInfoDiv.className = " text-info text-center mt-3 mb-2 font-weight-bold";
//      avgOdTblInfoDiv.innerHTML = " <u>Avg OD and Corresponding Avg Schedule, Actual(MW) and Frequency<49.90</u>"
//      avgOdTblDiv.appendChild(avgOdTblInfoDiv);

//      // avg od tbl
//      let avgOdTbl = document.createElement('table');
//      avgOdTbl.className = "table table-bordered table-hover display "
//      avgOdTbl.id = `${stateName}_avgOdTbl`;
//      avgOdTblDiv.appendChild(avgOdTbl);

//      //---------------------avg ud table and its children
//      // avg ud tbl div
//      let avgUdTblDiv = document.createElement("div");
//      avgUdTblDiv.className = "col-md-5";
//      avgOdUdTblsDiv.appendChild(avgUdTblDiv);
 
//     // div for meta info
//     let avgudTblInfoDiv = document.createElement("div");
//     avgudTblInfoDiv.className = " text-info text-center mt-3 mb-2 font-weight-bold";
//     avgudTblInfoDiv.innerHTML = " <u>Avg UD and Corresponding Avg Schedule, Actual(MW) and Frequency>50.05</u>"
//     avgUdTblDiv.appendChild(avgudTblInfoDiv);
    
//      // avg ud tbl
//      let avgUdTbl = document.createElement('table');
//      avgUdTbl.className = "table table-bordered table-hover display"
//      avgUdTbl.id = `${stateName}_avgUdTbl`;
//      avgUdTblDiv.appendChild(avgUdTbl);

//      //------------------------now net ui tbl start-------------------------

//      // div that holds net ui div
//      let netUiTblsDiv = document.createElement("div");
//      netUiTblsDiv.className = "row justify-content-md-center";
//      schVsActDrawlTableWrapper.appendChild(netUiTblsDiv);
    
//     // -------- net UI tble and children------------- 
//      // net ui tbl div 
//      let netUiTblDiv = document.createElement("div");
//      netUiTblDiv.className = "col-md-6";
//      netUiTblsDiv.appendChild(netUiTblDiv);
    
//      // div for meta info 
//      let netUiTblInfoDiv = document.createElement("div");
//      netUiTblInfoDiv.className = " text-info text-center mt-3 mb-2 font-weight-bold";
//      netUiTblInfoDiv.innerHTML = " <u>Net Deviation and Corresponding Net Schedule and Actual(MW) and Frequency b/w Band</u>"
//      netUiTblDiv.appendChild(netUiTblInfoDiv);

//      // net ui tbl
//      let netUiTbl = document.createElement('table');
//      netUiTbl.className = "table table-bordered table-hover display "
//      netUiTbl.id = `${stateName}_netUiTbl`;
//      netUiTblDiv.appendChild(netUiTbl);

//       // div for plotting horizontal rule
//       let hrDiv = document.createElement("div");
//       hrDiv.className = "hrStyle mt-3 mb-3";
//       schVsActDrawlTableWrapper.appendChild(hrDiv);
// }

export const createDynamicHtmlContent = (stateName:string, schVsActDrawlTableWrapper:HTMLDivElement)=>{
    

      //div for meta info 
      let maxUiTblInfoDiv = document.createElement("div");
      maxUiTblInfoDiv.className = " text-info text-center mt-3 mb-2 font-weight-bold text";
      maxUiTblInfoDiv.innerHTML = "<u>Instantaneous Max OD & Corresponding Schedule, Actual(MW) & Frequency</u>"
      schVsActDrawlTableWrapper.appendChild(maxUiTblInfoDiv);

      // instantaneous max ui table
      let maxUiTbl = document.createElement('table');
      maxUiTbl.className = "table table-bordered table-hover display  "
      maxUiTbl.id = `${stateName}_maxUiTbl`;
      schVsActDrawlTableWrapper.appendChild(maxUiTbl);

      //div for meta info 
      let minUiTblInfoDiv = document.createElement("div");
      minUiTblInfoDiv.className = " text-info text-center mt-3 mb-2 font-weight-bold text";
      minUiTblInfoDiv.innerHTML = "<u>Instantaneous Max UD & Corresponding Schedule, Actual(MW) & Frequency</u>"
      schVsActDrawlTableWrapper.appendChild(minUiTblInfoDiv);

      // instantaneous min ui table
      let minUiTbl = document.createElement('table');
      minUiTbl.className = "table table-bordered table-hover display "
      minUiTbl.id = `${stateName}_minUiTbl`;
      schVsActDrawlTableWrapper.appendChild(minUiTbl);
     
      //  div for meta info 
      let avgOdTblInfoDiv = document.createElement("div");
      avgOdTblInfoDiv.className = " text-info text-center mt-3 mb-2 font-weight-bold text";
      avgOdTblInfoDiv.innerHTML = " <u>Avg OD and Corresponding Avg Schedule, Actual(MW) and Frequency<49.90</u>"
      schVsActDrawlTableWrapper.appendChild(avgOdTblInfoDiv);
 
      // avg od tbl
      let avgOdTbl = document.createElement('table');
      avgOdTbl.className = "table table-bordered table-hover display  "
      avgOdTbl.id = `${stateName}_avgOdTbl`;
      schVsActDrawlTableWrapper.appendChild(avgOdTbl);
  
      // div for meta info
      let avgudTblInfoDiv = document.createElement("div");
      avgudTblInfoDiv.className = " text-info text-center mt-3 mb-2 font-weight-bold text";
      avgudTblInfoDiv.innerHTML = " <u>Avg UD and Corresponding Avg Schedule, Actual(MW) and Frequency>50.05</u>"
      schVsActDrawlTableWrapper.appendChild(avgudTblInfoDiv);
     
      // avg ud tbl
      let avgUdTbl = document.createElement('table');
      avgUdTbl.className = "table table-bordered table-hover display "
      avgUdTbl.id = `${stateName}_avgUdTbl`;
      schVsActDrawlTableWrapper.appendChild(avgUdTbl);
     
      // div for meta info 
      let netUiTblInfoDiv = document.createElement("div");
      netUiTblInfoDiv.className = " text-info text-center mt-3 mb-2 font-weight-bold tooltiptext";
      netUiTblInfoDiv.innerHTML = " <u>Net Deviation and Corresponding Net Schedule and Actual(MW) and Frequency b/w Band</u>"
      schVsActDrawlTableWrapper.appendChild(netUiTblInfoDiv);
 
      // net ui tbl
      let netUiTbl = document.createElement('table');
      netUiTbl.className = "table table-bordered table-hover display "
      netUiTbl.id = `${stateName}_netUiTbl`;
      schVsActDrawlTableWrapper.appendChild(netUiTbl);

      // div that holds two max frequncy and min frequecny table div
     let maxMinFreqTblsDiv = document.createElement("div");
     maxMinFreqTblsDiv.className = "row justify-content-between";
     schVsActDrawlTableWrapper.appendChild(maxMinFreqTblsDiv);
     
    //  ------------max Frequency tbl div and its children-----------------
     // instantaneous max Frequency div
     let maxTblDiv = document.createElement("div");
     maxTblDiv.className = "col-md-5";
     maxMinFreqTblsDiv.appendChild(maxTblDiv);

     // div for meta info 
     let maxTblInfoDiv = document.createElement("div");
     maxTblInfoDiv.className = " text-info text-center mt-3 mb-2 font-weight-bold";
     maxTblInfoDiv.innerHTML = "<u>Instantaneous Max Frequency & Corresponding Deviation(UI)</u>"
     maxTblDiv.appendChild(maxTblInfoDiv);
    
     // instantaneous max ui table
     let maxFreqTbl = document.createElement('table');
     maxFreqTbl.className = "table table-bordered table-hover display "
     maxFreqTbl.id = `${stateName}_maxFreqTbl`;
     maxTblDiv.appendChild(maxFreqTbl);

     //  ------------min Frequency tbl div and its children-----------------
     // instantaneous min Frequency div
     let minTblDiv = document.createElement("div");
     minTblDiv.className = "col-md-5";
     maxMinFreqTblsDiv.appendChild(minTblDiv);
    
     // div for meta info 
     let minTblInfoDiv = document.createElement("div");
     minTblInfoDiv.className = " text-info text-center mt-3 mb-2 font-weight-bold";
     minTblInfoDiv.innerHTML = "<u>Instantaneous Min Frequency & Corresponding Deviation(UI)</u>"
     minTblDiv.appendChild(minTblInfoDiv);

     // instantaneous min ui table
     let minFreqTbl = document.createElement('table');
     minFreqTbl.className = "table table-bordered table-hover display"
     minFreqTbl.id = `${stateName}_minFreqTbl`;
     minTblDiv.appendChild(minFreqTbl);

       // div for plotting horizontal rule
       let hrDiv = document.createElement("div");
       hrDiv.className = "hrStyle mt-3 mb-3";
       schVsActDrawlTableWrapper.appendChild(hrDiv);
 }