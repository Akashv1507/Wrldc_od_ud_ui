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
       
       
        
        freqProfData = {}

        try:
            connection = cx_Oracle.connect(self.connString)
            cur = connection.cursor()
        except Exception as err:
            print('error while creating a connection/cursor', err)
        else:
            currDate = start_date
            while currDate<=end_date:
                 # converting datetime obj to string and then integer, 2021-08-16-> 20210816
                currDateNumb = int(currDate.strftime('%Y%m%d'))
                fetch_freqProf_sql = '''SELECT fp.DATE_KEY , fp.FREQ6_VALUE AS less_than_Band, fp.FREQ7_VALUE AS Between_band, fp.FREQ8_VALUE AS greater_than_band
                        FROM REPORTING_UAT.FREQUENCY_PROFILE fp   
                        WHERE fp.DATE_KEY = :date_key '''
                cur.execute(fetch_freqProf_sql, {'date_key': currDateNumb})
                result = cur.fetchall()
                freqProfData[currDateNumb] =[{'parName': '<49.9Hz', 'value':result[0][1], 'legName':str(currDateNumb) },
                                        {'parName': '49.9Hz-50.05Hz', 'value':result[0][2], 'legName':str(currDateNumb) },
                                        {'parName': '>50.05Hz', 'value':result[0][3], 'legName':str(currDateNumb) }]    
                currDate = currDate + dt.timedelta(days=1)        
        finally:
            if cur:
                cur.close()
            if connection:
                connection.close()
        
        return freqProfData