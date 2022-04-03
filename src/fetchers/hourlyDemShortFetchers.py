import datetime as dt
from typing import List, Tuple
import cx_Oracle
import pandas as pd
from src.helperFunctions import convertIntToDateStr

class HourlyDemShortFetchers():
    """class to fetch hourly demand and shortage data
    """     
    connString:str = ''

    def __init__(self, connStr: str) -> None:
        """constructor

        Args:
            connStr (str): psp db connection string
        """
        self.connString = connStr
    def getListOfHourlyDemShortObj (self, hourlyDemShortDf:pd.DataFrame, startDate:int, endDate:int):

        listOfHourlyDemShortObj =[]
        currDate = startDate
        while currDate<=endDate:
            currDateNumb = int(currDate.strftime('%Y%m%d'))
            for hr in range (1, 25):
                filteredDf = hourlyDemShortDf[(hourlyDemShortDf['DATE_KEY']==currDateNumb) & (hourlyDemShortDf['HOUR_ID']==hr)]
                
                if len(filteredDf)>0:
                    dayHrDemandShortObj = {'dateKey': convertIntToDateStr(currDateNumb), 'hour': hr}
                    for ind in filteredDf.index:
                        stateName = filteredDf['FULL_NAME'][ind]
                        dayHrDemandShortObj[f'{stateName}_dem'] = float(filteredDf['HOUR_DEMAND'][ind])
                        dayHrDemandShortObj[f'{stateName}_short'] = float(filteredDf['HOUR_LOAD_SHEDDING'][ind])
                    listOfHourlyDemShortObj.append(dayHrDemandShortObj)
                else:
                    listOfHourlyDemShortObj.append({'dateKey': convertIntToDateStr(currDateNumb), 'hour': hr, 'AMNSIL_dem':0.00, 'AMNSIL_short':0.00, 'CH_dem':0.00, 'CH_short':0.00, 'DNH_dem':0.00, 'DNH_short':0.00, 'DD_dem':0.00, 'DD_short':0.00, 'GOA_dem':0.00, 'GOA_short':0.00, 'GUJ_dem':0.00, 'GUJ_short':0.00, 'MP_dem':0.00, 'MP_short':0.00, 'MAH_dem':0.00, 'MAH_short':0.00})
                    
            currDate = currDate + dt.timedelta(days=1)

        for hourlyDemShortObj in listOfHourlyDemShortObj:
            wrHourlyDem =0
            wrHourlyShort =0
            for ele in hourlyDemShortObj.items():
                if ele[0].endswith('_dem'):
                    wrHourlyDem = wrHourlyDem+ ele[1]
                if ele[0].endswith('_short'):
                    wrHourlyShort = wrHourlyShort + ele[1]
            hourlyDemShortObj['WR_dem'] = round(wrHourlyDem,2)
            hourlyDemShortObj['WR_short'] = round(wrHourlyShort,2)
        return listOfHourlyDemShortObj


    def getHourlyDemShortageData (self, startDate:dt.datetime, endDate:dt.datetime):

        # converting datetime obj to string and then integer, 2021-08-16-> 20210816
        numbStartDate = int(startDate.strftime('%Y%m%d'))
        numbEndDate = int(endDate.strftime('%Y%m%d'))

        try:
            connection = cx_Oracle.connect(self.connString)
            cur = connection.cursor()
        except Exception as err:
            print('error while creating a connection/cursor', err)
        else:
            fetchSqlQuery = 'SELECT ssdh.date_key, ssdh.HOUR_ID, dss.FULL_NAME , coalesce ( ssdh.HOUR_DEMAND , 0 ) HOUR_DEMAND, coalesce ( ssdh.HOUR_LOAD_SHEDDING , 0 ) HOUR_LOAD_SHEDDING  FROM REPORTING_UAT.STG_STATE_DATA_HOURLY ssdh INNER JOIN  REPORTING_UAT.DIM_SRLDC_STATE dss ON SSDH.srldc_state_key = dss.srldc_state_key where  date_key between  :start_date and :end_date order by dss.FULL_NAME , ssdh.date_key, ssdh.HOUR_ID '
            try:
                demShortResultDf = pd.read_sql(fetchSqlQuery, params={'start_date': numbStartDate, 'end_date': numbEndDate}, con=connection)
                replaceStateVal = {"CHHATTISGARH":"CH", "DADRA AND NAGAR HAVELI":"DNH", "DAMAN AND DIU":"DD", "MADHYA PRADESH":"MP", "MAHARASHTRA":"MAH",  "GUJARAT":"GUJ" }  
                demShortResultDf = demShortResultDf.replace({"FULL_NAME": replaceStateVal}) 
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
        listOfHourlyDemShortObj = self.getListOfHourlyDemShortObj(demShortResultDf, startDate, endDate)
        return listOfHourlyDemShortObj