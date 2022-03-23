import datetime as dt
from typing import List, Tuple
import cx_Oracle
import pandas as pd
from src.fetchers.MorningAppraisalReport.section_state_sql import fetch_WRDate_sql, fetchWrMaxWind_Sql, fetchWrMaxSolar_Sql

class SectionStateFetcher():

    def __init__(self, connStr: str) -> None:
        """constructor

        Args:
            connStr (str): psp db connection string
        """
        self.connString = connStr

       
    def fetchSectionStateData(self, start_date: dt.datetime, end_date: dt.datetime):
       
        # converting datetime obj to string and then integer, 2021-08-16-> 20210816
        numbStartDate = int(start_date.strftime('%Y%m%d'))
        numbEndDate = int(end_date.strftime('%Y%m%d'))
        # getting prev date of start date(prev of report date) that will be 
        soFarHighestNumbShowDate = numbStartDate-1
        entityList = [{'entityName':"GUJARAT", 'entityId':'Guj'}, {'entityName':"MADHYA PRADESH", 'entityId':'MP'}, {'entityName':"MAHARASHTRA", 'entityId':'Mah'}, {'entityName':"CHHATTISGARH", 'entityId':'Chatt'}, {'entityName':"WR", 'entityId':'WR'}]
        entiyResultList = []

        try:
            connection = cx_Oracle.connect(self.connString)
            cur = connection.cursor()
        except Exception as err:
            print('error while creating a connection/cursor', err)
        else:
            for entity in entityList:
                if entity['entityName'] == 'WR':
                    fetch_TargetDate_sql = fetch_WRDate_sql
                    fetch_PrevDate_sql =  fetch_WRDate_sql
                    fetch_SofarMaxConsump_sql = '''WITH wr_consumption(date_key,consumption) AS (SELECT DATE_KEY ,sum(consumption) AS CONSUMPTION FROM REPORTING_UAT.state_load_details WHERE date_key BETWEEN 20190101 AND :end_date GROUP BY DATE_KEY)SELECT date_key, consumption FROM wr_consumption WHERE CONSUMPTION = (SELECT max(CONSUMPTION) FROM wr_consumption)'''
                    fetch_SofarMaxWind_sql = fetchWrMaxWind_Sql
                    fetch_SofarMaxSolar_sql = fetchWrMaxSolar_Sql

                    cur.execute(fetch_TargetDate_sql,{'date_key': numbEndDate})
                    targetDtResult = cur.fetchall()
                    cur.execute(fetch_PrevDate_sql, {'date_key': numbStartDate})
                    prevDtResult = cur.fetchall()
                    cur.execute(fetch_SofarMaxConsump_sql, {'end_date':numbEndDate })
                    sofarMaxConsumpResult = cur.fetchall()
                    cur.execute(fetch_SofarMaxWind_sql, {'end_date':numbEndDate })
                    sofarMaxWindResult = cur.fetchall()
                    cur.execute(fetch_SofarMaxSolar_sql, {'end_date':numbEndDate })
                    soFarMaxSolarResult = cur.fetchall()
                else:
                    fetch_TargetDate_sql = '''SELECT date_key, consumption, wind, solar FROM REPORTING_UAT.state_load_details where date_key =:date_key and state_name =:state_name'''
                    fetch_PrevDate_sql = '''SELECT date_key, consumption, wind, solar FROM REPORTING_UAT.state_load_details where date_key =:date_key and state_name =:state_name'''
                    fetch_SofarMaxConsump_sql = '''SELECT date_key, consumption FROM REPORTING_UAT.state_load_details where consumption = (select max(consumption) FROM REPORTING_UAT.state_load_details where date_key between 20190101 and :end_date and state_name =:state_name)'''
                    fetch_SofarMaxWind_sql = '''SELECT date_key, wind FROM REPORTING_UAT.state_load_details where wind = (select max(wind) FROM REPORTING_UAT.state_load_details where date_key between 20190101 and :end_date and state_name =:state_name)'''
                    fetch_SofarMaxSolar_sql = '''SELECT date_key, solar FROM REPORTING_UAT.state_load_details where solar = (select max(solar) FROM REPORTING_UAT.state_load_details where date_key between 20190101 and :end_date and state_name =:state_name)'''               
                    cur.execute(fetch_TargetDate_sql,{'date_key': numbEndDate, 'state_name': entity['entityName']})
                    targetDtResult = cur.fetchall()
                    cur.execute(fetch_PrevDate_sql, {'date_key': numbStartDate, 'state_name': entity['entityName']})
                    prevDtResult = cur.fetchall()
                    cur.execute(fetch_SofarMaxConsump_sql, {'end_date':numbEndDate , 'state_name': entity['entityName']})
                    sofarMaxConsumpResult = cur.fetchall()
                    cur.execute(fetch_SofarMaxWind_sql, {'end_date':numbEndDate , 'state_name': entity['entityName']})
                    sofarMaxWindResult = cur.fetchall()
                    cur.execute(fetch_SofarMaxSolar_sql, {'end_date':numbEndDate , 'state_name': entity['entityName']})
                    soFarMaxSolarResult = cur.fetchall()

                fetch_TargetDateMaxDemand_sql = '''SELECT date_key, max_demand FROM REPORTING_UAT.state_demand_requirement where date_key =:end_date and state_name =:state_name'''
                fetch_PrevDateMaxDemand_sql = '''SELECT date_key, max_demand FROM REPORTING_UAT.state_demand_requirement where date_key =:start_date and state_name =:state_name'''
                fetch_SoFarMaxDemand_sql = '''SELECT date_key, max_demand FROM REPORTING_UAT.state_demand_requirement where max_demand = (select max(max_demand) FROM REPORTING_UAT.state_demand_requirement where date_key between 20190101 and :end_date and state_name =:state_name) '''
                cur.execute(fetch_TargetDateMaxDemand_sql, {'end_date':numbEndDate , 'state_name': entity['entityName']})
                targetDtMaxDemResult = cur.fetchall()
                cur.execute(fetch_PrevDateMaxDemand_sql, {'start_date':numbStartDate , 'state_name': entity['entityName']})
                prevDtMaxDemResult = cur.fetchall()
                cur.execute(fetch_SoFarMaxDemand_sql, {'end_date':numbEndDate , 'state_name': entity['entityName']})
                sofarMaxDemResult = cur.fetchall()
                entityObj = {
                    'maxDem':[{'dateKey':str(prevDtMaxDemResult[0][0]),'val':prevDtMaxDemResult[0][1], 'showDateKey':str(prevDtMaxDemResult[0][0])}, {'dateKey':str(targetDtMaxDemResult[0][0]),'val':targetDtMaxDemResult[0][1], 'showDateKey':str(targetDtMaxDemResult[0][0])}, {'dateKey':str(sofarMaxDemResult[0][0]),'val':sofarMaxDemResult[0][1], 'showDateKey':str(soFarHighestNumbShowDate)}],
                    'consumption':[{'dateKey':str(prevDtResult[0][0]),'val':prevDtResult[0][1], 'showDateKey':str(prevDtResult[0][0])}, {'dateKey':str(targetDtResult[0][0]),'val':targetDtResult[0][1], 'showDateKey':str(targetDtResult[0][0])}, {'dateKey':str(sofarMaxConsumpResult[0][0]), 'val':sofarMaxConsumpResult[0][1], 'showDateKey':str(soFarHighestNumbShowDate) }],
                    'wind':[{'dateKey':str(prevDtResult[0][0]),'val':prevDtResult[0][2], 'showDateKey':str(prevDtResult[0][0])}, {'dateKey':str(targetDtResult[0][0]),'val':targetDtResult[0][2], 'showDateKey':str(targetDtResult[0][0])}, {'dateKey':str(sofarMaxWindResult[0][0]),'val':sofarMaxWindResult[0][1], 'showDateKey':str(soFarHighestNumbShowDate) }],
                    'solar':[{'dateKey':str(prevDtResult[0][0]),'val':prevDtResult[0][3], 'showDateKey':str(prevDtResult[0][0])}, {'dateKey':str(targetDtResult[0][0]),'val':targetDtResult[0][3], 'showDateKey':str(targetDtResult[0][0])}, {'dateKey':str(soFarMaxSolarResult[0][0]),'val':soFarMaxSolarResult[0][1], 'showDateKey':str(soFarHighestNumbShowDate)}],
                    'entity' : entity['entityId']  }

                entiyResultList.append(entityObj)
        finally:
            if cur:
                cur.close()
            if connection:
                connection.close()
        
        return entiyResultList