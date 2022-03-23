import datetime as dt
from typing import List, Tuple
import cx_Oracle
import pandas as pd

class SectionFreqProfileFetcher():

    def __init__(self, connStr: str) -> None:
        """constructor
        Args:
            connStr (str): psp db connection string
        """
        self.connString = connStr

       
    def fetchSectionFreqProfilePlotData(self, start_date: dt.datetime, end_date: dt.datetime):
       
        # converting datetime obj to string and then integer, 2021-08-16-> 20210816
        numbStartDate = int(start_date.strftime('%Y%m%d'))
        numbEndDate = int(end_date.strftime('%Y%m%d'))
        freqProfData = {}

        try:
            connection = cx_Oracle.connect(self.connString)
            cur = connection.cursor()
        except Exception as err:
            print('error while creating a connection/cursor', err)
        else:
            
            for dateKey in range(numbStartDate, numbEndDate+1):
                fetch_freqProf_sql = '''SELECT fp.DATE_KEY , fp.FREQ6_VALUE AS less_than_Band, fp.FREQ7_VALUE AS Between_band, fp.FREQ8_VALUE AS greater_than_band
                        FROM REPORTING_UAT.FREQUENCY_PROFILE fp   
                        WHERE fp.DATE_KEY = :date_key '''
                cur.execute(fetch_freqProf_sql, {'date_key': dateKey})
                result = cur.fetchall()
                freqProfData[dateKey] =[{'parName': '<49.9Hz', 'value':result[0][1], 'legName':str(dateKey) },
                                        {'parName': '49.9Hz-50.05Hz', 'value':result[0][2], 'legName':str(dateKey) },
                                        {'parName': '>50.05Hz', 'value':result[0][3], 'legName':str(dateKey) }]           
        finally:
            if cur:
                cur.close()
            if connection:
                connection.close()
        
        return freqProfData