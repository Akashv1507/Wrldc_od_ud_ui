import datetime as dt
from typing import List, Tuple
import cx_Oracle
import pandas as pd

class Section2Fetcher():

    def __init__(self, connStr: str) -> None:
        """constructor

        Args:
            connStr (str): psp db connection string
        """
        self.connString = connStr

    def toListOfDict(self, section2Df:pd.DataFrame):
        
        # generating maximum with time column as per report
        section2Df['MAX_WITH_TIME'] =  section2Df['MAX_DEMAND'].astype(str) + " at " + section2Df['MAX_DEMAND_TIME'].astype(str) 
        # deleting unused two columns 
        del section2Df['MAX_DEMAND']
        del section2Df['MAX_DEMAND_TIME']

        section2Data: List[Tuple] = []
        groupedSection2Df = section2Df.groupby("DATE_KEY")

        #iterating through each groups and appending required object into list
        for nameOfGroup,groupDf in groupedSection2Df:
            
            groupDf.reset_index(inplace=True, drop= True)
            # converting 20220307-> 2022-03-07
            dateKeyStr = str(nameOfGroup)
            dateKeyStr = dateKeyStr[:4]+ '-' + dateKeyStr[4:6] + '-' + dateKeyStr[6:]
            section2Obj = {"date": dateKeyStr}
            
            # deleting DATE_KEY column
            del groupDf['DATE_KEY']

             # convert each day values to list
            section2Dict = groupDf.to_dict(orient="index")
            section2ValList = list(section2Dict.values())
            section2Obj["values"] = section2ValList
            section2Data.append(section2Obj)
        return section2Data

    def getDiffMaxHighestDemand(self, section2Df:pd.DataFrame, numbStartDate, numbEndDate):
        
        del section2Df['MAX_DEMAND_TIME']
      
        pivotDf= pd.pivot_table(section2Df, values = 'MAX_DEMAND', columns = 'DATE_KEY', index=["STATE_NAME"]).reset_index()
        pivotDf['diff'] = pivotDf[numbEndDate]-pivotDf[numbStartDate]

        # deleting unused column
        del pivotDf[numbEndDate]
        del pivotDf[numbStartDate]
       
        section2DiffDict = pivotDf.to_dict(orient="index")
        section2DiffList = list(section2DiffDict.values())
        return section2DiffList
    
    def fetchSection2Data(self, start_date: dt.datetime, end_date: dt.datetime):
       

        # converting datetime obj to string and then integer, 2021-08-16-> 20210816
        numbStartDate = int(start_date.strftime('%Y%m%d'))
        numbEndDate = int(end_date.strftime('%Y%m%d'))

        try:
            connection = cx_Oracle.connect(self.connString)
            cur = connection.cursor()
        except Exception as err:
            print('error while creating a connection/cursor', err)
        else:
            fetch_sql = "SELECT date_key, state_name, max_demand, max_demand_time FROM REPORTING_UAT.state_demand_requirement where date_key between :start_date and :end_date order by date_key, state_name"
            section2Df = pd.read_sql(fetch_sql, params={'start_date': numbStartDate, 'end_date': numbEndDate}, con=connection)   
            replaceStateVal = {"CHHATTISGARH":"CH", "DADRA AND NAGAR HAVELI":"DNH", "DAMAN AND DIU":"DD", "MADHYA PRADESH":"MP", "MAHARASHTRA":"MAH",  "GUJARAT":"GUJ" }  
            section2Df = section2Df.replace({"STATE_NAME": replaceStateVal})    
            section2Dfcopy = section2Df.copy()
            
        finally:
            cur.close()
            connection.close()
        
        section2MaxData = self.toListOfDict(section2Dfcopy)
        section2DiffData = self.getDiffMaxHighestDemand(section2Df, numbStartDate, numbEndDate)

        return {"section2MaxData": section2MaxData, "section2DiffData":section2DiffData}
