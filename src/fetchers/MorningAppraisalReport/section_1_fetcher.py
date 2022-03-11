import datetime as dt
from typing import List, Tuple
import cx_Oracle
import pandas as pd

class Section1Fetcher():

    def __init__(self, connStr: str) -> None:
        """constructor

        Args:
            connStr (str): psp db connection string
        """
        self.connString = connStr

    def toListOfDict(self, section1Df:pd.DataFrame):
        
        section1Data: List[Tuple] = []

        groupedSection1Df = section1Df.groupby("DATE_KEY")
        #iterating through each groups and appending required object into list

        for nameOfGroup,groupDf in groupedSection1Df:
            groupDf.reset_index(inplace=True, drop= True)
            # converting 20220307-> 2022-03-07
            dateKeyStr = str(nameOfGroup)
            dateKeyStr = dateKeyStr[:4]+ '-' + dateKeyStr[4:6] + '-' + dateKeyStr[6:]
            section1Obj = {"date": dateKeyStr}

            # deleting DATE_KEY column
            del groupDf['DATE_KEY']

             # convert each day values to list
            section1Dict = groupDf.to_dict(orient="index")
            section1ValList = list(section1Dict.values())
            section1Obj["values"] = section1ValList
            section1Data.append(section1Obj)
        return section1Data


    def fetchSection1Data(self, start_date: dt.datetime, end_date: dt.datetime):  

        # converting datetime obj to string and then integer, 2021-08-16-> 20210816
        numbStartDate = int(start_date.strftime('%Y%m%d'))
        numbEndDate = int(end_date.strftime('%Y%m%d'))

        try:
            connection = cx_Oracle.connect(self.connString)
            cur = connection.cursor()
        except Exception as err:
            print('error while creating a connection/cursor', err)
        else:
            fetch_stateSql = "SELECT date_key, state_name, consumption FROM REPORTING_UAT.state_load_details where date_key between :start_date and :end_date order by date_key, state_name"
            section1StateDf = pd.read_sql(fetch_stateSql, params={'start_date': numbStartDate, 'end_date': numbEndDate}, con=connection)
            replaceStateVal = {"CHHATTISGARH":"CH", "DADRA AND NAGAR HAVELI":"DNH", "DAMAN AND DIU":"DD", "MADHYA PRADESH":"MP", "MAHARASHTRA":"MAH",  "GUJARAT":"GUJ" }  
            section1StateDf = section1StateDf.replace({"STATE_NAME": replaceStateVal})   

            fetch_wrSql = "SELECT date_key, sum(consumption) as consumption  FROM REPORTING_UAT.state_load_details where date_key between :start_date and :end_date group by date_key order by date_key"
            section1WrDf = pd.read_sql(fetch_wrSql, params={'start_date': numbStartDate, 'end_date': numbEndDate}, con=connection) 
            section1WrDf.insert(1, "STATE_NAME", "WR")
            
            section1Df = pd.concat([section1WrDf, section1StateDf], ignore_index=True)
            section1DfCopy = section1Df.copy()          
        finally:
            cur.close()
            connection.close()
        #combining state data with wr data 

        section1ConsumpData = self.toListOfDict(section1DfCopy)   
        return  section1ConsumpData
