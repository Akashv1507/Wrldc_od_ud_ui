import datetime as dt
from typing import List, Tuple
import cx_Oracle
import pandas as pd
from src.fetchers.MorningAppraisalReport.section_ists_sql import fetch_istsWindDay_sql, fetch_istsSolarDay_sql, fetch_istsMaxWind_sql, fetch_istsMaxSolar_sql

class SectionIstsReFetcher():

    def __init__(self, connStr: str) -> None:
        """constructor

        Args:
            connStr (str): psp db connection string
        """
        self.connString = connStr

       
    def fetchSectionIstsReData(self, start_date: dt.datetime, end_date: dt.datetime):
       
        # converting datetime obj to string and then integer, 2021-08-16-> 20210816
        numbStartDate = int(start_date.strftime('%Y%m%d'))
        numbEndDate = int(end_date.strftime('%Y%m%d'))
        soFarHighestNumbShowDate = numbStartDate-1
        istsReObj = {}

        try:
            connection = cx_Oracle.connect(self.connString)
            cur = connection.cursor()
        except Exception as err:
            print('error while creating a connection/cursor', err)
        else:
            
            cur.execute(fetch_istsWindDay_sql,{'date_key': numbEndDate})
            targetDtWindResult = cur.fetchall()
            cur.execute(fetch_istsWindDay_sql, {'date_key': numbStartDate})
            prevDtWindResult = cur.fetchall()
            cur.execute(fetch_istsSolarDay_sql, {'date_key':numbEndDate })
            targetDtSolarResult = cur.fetchall()
            cur.execute(fetch_istsSolarDay_sql, {'date_key':numbStartDate })
            prevDtSolarResult = cur.fetchall()
            cur.execute(fetch_istsMaxWind_sql, {'end_date':numbEndDate })
            maxWindResult = cur.fetchall()
            cur.execute(fetch_istsMaxSolar_sql, {'end_date':numbEndDate })
            maxSolarResult = cur.fetchall()
                 
            istsReObj = {
                'windGen':[{'dateKey':str(maxWindResult[0][0]),'val':maxWindResult[0][1], 'showDateKey':str(soFarHighestNumbShowDate)}, {'dateKey':str(prevDtWindResult[0][0]),'val':prevDtWindResult[0][1], 'showDateKey':str(prevDtWindResult[0][0])}, {'dateKey':str(targetDtWindResult[0][0]),'val':targetDtWindResult[0][1], 'showDateKey':str(targetDtWindResult[0][0])}],
                'solarGen':[{'dateKey':str(maxSolarResult[0][0]),'val':maxSolarResult[0][1], 'showDateKey':str(soFarHighestNumbShowDate)}, {'dateKey':str(prevDtSolarResult[0][0]),'val':prevDtSolarResult[0][1], 'showDateKey':str(prevDtSolarResult[0][0])}, {'dateKey':str(targetDtSolarResult[0][0]),'val':targetDtSolarResult[0][1], 'showDateKey':str(targetDtSolarResult[0][0])}],     
                }
               
        finally:
            if cur:
                cur.close()
            if connection:
                connection.close()
        
        return istsReObj