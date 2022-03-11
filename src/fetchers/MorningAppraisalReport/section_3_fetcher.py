import datetime as dt
from typing import List, Tuple
import cx_Oracle
import pandas as pd
from src.fetchers.MorningAppraisalReport.section_3_sql import generationFetchSql


class Section3Fetcher():

    def __init__(self, connStr: str) -> None:
        """constructor

        Args:
            connStr (str): psp db connection string
        """
        self.connString = connStr

    def fetchSection3Data(self, start_date: dt.datetime, end_date: dt.datetime):  

        # converting datetime obj to string and then integer, 2021-08-16-> 20210816
        numbStartDate = int(start_date.strftime('%Y%m%d'))
        numbEndDate = int(end_date.strftime('%Y%m%d'))
        section3List = []
        try:
            connection = cx_Oracle.connect(self.connString)
            cur = connection.cursor()
        except Exception as err:
            print('error while creating a connection/cursor', err)
        else:
            for dateKey in [numbStartDate, numbEndDate]:
                dateKeyStr = str(dateKey)
                dateKeyStr = dateKeyStr[:4]+ '-' + dateKeyStr[4:6] + '-' + dateKeyStr[6:]
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
                
                section3List.append((dateKeyStr, thermalGen, solarGen, windGen, hydroGen, other, totalGen, solarGen+windGen, (solarGen+windGen+hydroGen)*100/totalGen, (solarGen+windGen)*100/totalGen ))
                    
        finally:
            cur.close()
            connection.close()

        return section3List
        