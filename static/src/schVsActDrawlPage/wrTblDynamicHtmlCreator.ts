export const createWrTblDynamicHtml = (wrTableWrapper:HTMLDivElement)=>{
    
    // max frequency and corresponding deviation tbl
    let maxFreqTbl = document.createElement('table');
    maxFreqTbl.className = "table table-bordered table-hover display "
    maxFreqTbl.id = `wr_max_freq`;
    wrTableWrapper.appendChild(maxFreqTbl);

    
    // min frequency and corresponding deviation tbl
    let minFreqTbl = document.createElement('table');
    minFreqTbl.className = "table table-bordered table-hover display"
    minFreqTbl.id = `wr_min_freq`;
    wrTableWrapper.appendChild(minFreqTbl);

     
}