import datetime as dt
from typing import List, Tuple
import cx_Oracle
import pandas as pd

class Section7Fetcher():

    def __init__(self, connStr: str) -> None:
        """constructor

        Args:
            connStr (str): psp db connection string
        """
        self.connString = connStr
       
    def fetchSection7DayData(self, targetDate:dt.datetime, tblName:str):
       
        startTime = targetDate.replace(hour=0, minute=0, second=0)
        endTime = startTime+dt.timedelta(hours=23, minutes=59)
        startTime=  str(startTime)
        endTime = str(endTime)
        responseList =[0, 0, 0, 0]
        try:
            connection = cx_Oracle.connect(self.connString)
            cur = connection.cursor()
        except Exception as err:
            print('error while creating a connection/cursor', err)
        else:
            fetch_priceParams_sql = f"SELECT AVG(DATA_VALUE)/1000 AS ACP, MIN(DATA_VALUE)/1000 AS MIN_MCP , MAX(DATA_VALUE)/1000 AS MAX_MCP FROM MO_WAREHOUSE.{tblName}  WHERE COL_ATTRIBUTES ='MCP (Rs/MWh) ' AND time_stamp BETWEEN TO_DATE(:start_time,'YYYY-MM-DD HH24:MI:SS' ) AND TO_DATE(:end_time,'YYYY-MM-DD HH24:MI:SS')" 
            fetch_mcvMu_sql = f"SELECT AVG(DATA_VALUE)*0.024 AS MCV FROM MO_WAREHOUSE.{tblName} id WHERE COL_ATTRIBUTES ='MCV (MW)' AND time_stamp BETWEEN TO_DATE(:start_time,'YYYY-MM-DD HH24:MI:SS' ) AND TO_DATE(:end_time,'YYYY-MM-DD HH24:MI:SS')"
            try:
                cur.execute(fetch_priceParams_sql,{'start_time': startTime, 'end_time': endTime})
                priceParamsResult = cur.fetchall()
                cur.execute(fetch_mcvMu_sql,{'start_time': startTime, 'end_time': endTime})
                mcvMuResult = cur.fetchall()
                # responseList = [MCU(MU), Avg ACP, Max ACP, Min ACP ]
                #handling None cases
                responseList =[0 if not mcvMuResult[0][0] else mcvMuResult[0][0], 0 if not priceParamsResult[0][0] else priceParamsResult[0][0], 0 if not priceParamsResult[0][2] else priceParamsResult[0][2], 0 if not priceParamsResult[0][1] else priceParamsResult[0][1] ]
            except Exception as err:
                print ('error while executing sql query', err)
                if cur:
                    cur.close()
                if connection:
                    connection.close()
        finally:
            if cur:
                cur.close()
            if connection:
                connection.close()
        
        return responseList

    def fetchSection7Data(self, starDate:dt.datetime, endDate:dt.datetime):
        section7Data = []
        currDate = starDate

        while currDate<=endDate:
            dayObj ={'dateKey': str(currDate.date())}
            for tbl in ['IEX_DAM', 'IEX_RTM', 'IEX_GDAM']:
               parResponseList = self.fetchSection7DayData(currDate, tbl)
               dayObj[tbl] = parResponseList
            section7Data.append(dayObj)
            currDate = currDate+dt.timedelta(days=1)
        return section7Data


