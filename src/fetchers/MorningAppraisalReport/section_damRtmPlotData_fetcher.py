import datetime as dt
from typing import List, Tuple
import cx_Oracle
import pandas as pd

class SectionDamRtmPlotDataFetcher():

    def __init__(self, connStr: str) -> None:
        """constructor

        Args:
            connStr (str): psp db connection string
        """
        self.connString = connStr
    def convertTimestampToString(self, parameterListData:List[List]):
        newParList =[]
        for ele in parameterListData:
            newParList.append((str(ele[0]), ele[1]))
        return newParList

    def fetchDamRtmDayPlotData(self, targetDate:dt.datetime, tblName:str):
       
        startTime = targetDate.replace(hour=0, minute=0, second=0)
        endTime = startTime+dt.timedelta(hours=23, minutes=59)
        startTime=  str(startTime)
        endTime = str(endTime)
        acpResultList= []
        try:
            connection = cx_Oracle.connect(self.connString)
            cur = connection.cursor()
        except Exception as err:
            print('error while creating a connection/cursor', err)
        else:
            fetchAcp_sql = f"SELECT TIME_STAMP, DATA_VALUE/1000 FROM MO_WAREHOUSE.{tblName}  WHERE COL_ATTRIBUTES ='MCP (Rs/MWh) ' AND time_stamp BETWEEN TO_DATE(:start_time,'YYYY-MM-DD HH24:MI:SS' ) AND TO_DATE(:end_time,'YYYY-MM-DD HH24:MI:SS')" 
            try:
                cur.execute(fetchAcp_sql,{'start_time': startTime, 'end_time': endTime})
                acpResultList = cur.fetchall()
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
        newAcpResultList = self.convertTimestampToString(acpResultList)
        return newAcpResultList

    def fetchDamRtmPlotData(self, starDate:dt.datetime, endDate:dt.datetime):
        damRtmPlotData = []
        currDate = starDate

        while currDate<=endDate:
            dayObj={'dateKey': str(currDate.date())}
            for tbl in ['IEX_DAM', 'IEX_RTM']:
                plotData =self.fetchDamRtmDayPlotData(currDate, tbl)
                dayObj[tbl] = plotData
            damRtmPlotData.append(dayObj)
            currDate = currDate+dt.timedelta(days=1)
        return damRtmPlotData

