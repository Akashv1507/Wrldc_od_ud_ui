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

        genPlotData = {}
        try:
            connection = cx_Oracle.connect(self.connString)
            cur = connection.cursor()
        except Exception as err:
            print('error while creating a connection/cursor', err)
        else:
            currDate = start_date
            while currDate<=end_date:
                currDateNumb = int(currDate.strftime('%Y%m%d'))
                thermalGen = 0
                windGen= 0
                solarGen=0
                hydroGen = 0
                other = 0
                totalGen =0

                cur.execute(generationFetchSql,{'date_key': currDateNumb})
                result = cur.fetchall()
                for row in result:
                    thermalGen = thermalGen + (0 if not row[2] else row[2])
                    solarGen = solarGen + (0 if not row[3] else row[3])
                    windGen = windGen + (0 if not row[4] else row[4])
                    hydroGen = hydroGen + (0 if not row[5] else row[5])
                    other = other + (0 if not row[6] else row[6])
                    totalGen = totalGen + (0 if not row[7] else row[7])

                genPlotData[currDateNumb] =[{'parName': 'Thermal', 'value':round(thermalGen,1), 'legName':str(currDateNumb) },
                                        {'parName': 'Solar', 'value':round(solarGen,1), 'legName':str(currDateNumb) },
                                        {'parName': 'Wind', 'value':round(windGen,1), 'legName':str(currDateNumb) },
                                        {'parName': 'Hydro', 'value':round(hydroGen,1), 'legName':str(currDateNumb) },
                                        {'parName': 'Other', 'value':round(other,1), 'legName':str(currDateNumb) },
                                        {'parName': 'Total', 'value':round(totalGen,1), 'legName':str(currDateNumb) },
                                        {'parName': 'RE-Total', 'value':round((solarGen+windGen),1), 'legName':str(currDateNumb) }]     
                currDate = currDate + dt.timedelta(days=1)              
        finally:
            if cur:
                cur.close()
            if connection:
                connection.close()

        return genPlotData