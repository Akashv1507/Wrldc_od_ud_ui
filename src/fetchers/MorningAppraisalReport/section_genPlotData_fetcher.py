import datetime as dt
from typing import List, Tuple
import cx_Oracle
import pandas as pd
from src.fetchers.MorningAppraisalReport.section_3Gen_sql import generationFetchSql


class SectionGenPlotDataFetcher():

    def __init__(self, connStr: str) -> None:
        """constructor

        Args:
            connStr (str): psp db connection string
        """
        self.connString = connStr

    def fetchGenPlotDataData(self, start_date: dt.datetime, end_date: dt.datetime):  

        # converting datetime obj to string and then integer, 2021-08-16-> 20210816
        numbStartDate = int(start_date.strftime('%Y%m%d'))
        numbEndDate = int(end_date.strftime('%Y%m%d'))
        genPlotData = {}
        try:
            connection = cx_Oracle.connect(self.connString)
            cur = connection.cursor()
        except Exception as err:
            print('error while creating a connection/cursor', err)
        else:
            for dateKey in range(numbStartDate, numbEndDate+1):
                thermalGen = 0
                windGen= 0
                solarGen=0
                hydroGen = 0
                other = 0
                totalGen =0

                cur.execute(generationFetchSql,{'date_key': dateKey})
                result = cur.fetchall()
                for row in result:
                    thermalGen = thermalGen + (0 if not row[2] else row[2])
                    solarGen = solarGen + (0 if not row[3] else row[3])
                    windGen = windGen + (0 if not row[4] else row[4])
                    hydroGen = hydroGen + (0 if not row[5] else row[5])
                    other = other + (0 if not row[6] else row[6])
                    totalGen = totalGen + (0 if not row[7] else row[7])

                genPlotData[dateKey] =[{'parName': 'Thermal', 'value':round(thermalGen,1), 'legName':str(dateKey) },
                                        {'parName': 'Solar', 'value':round(solarGen,1), 'legName':str(dateKey) },
                                        {'parName': 'Wind', 'value':round(windGen,1), 'legName':str(dateKey) },
                                        {'parName': 'Hydro', 'value':round(hydroGen,1), 'legName':str(dateKey) },
                                        {'parName': 'Other', 'value':round(other,1), 'legName':str(dateKey) },
                                        {'parName': 'Total', 'value':round(totalGen,1), 'legName':str(dateKey) },
                                        {'parName': 'RE-Total', 'value':round((solarGen+windGen),1), 'legName':str(dateKey) }]                   
        finally:
            if cur:
                cur.close()
            if connection:
                connection.close()

        return genPlotData