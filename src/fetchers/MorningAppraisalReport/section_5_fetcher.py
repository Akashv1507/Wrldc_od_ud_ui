import datetime as dt
from typing import List, Tuple
import cx_Oracle
import pandas as pd

class Section5Fetcher():

    def __init__(self, connStr: str) -> None:
        """constructor

        Args:
            connStr (str): psp db connection string
        """
        self.connString = connStr

    def toListOfDict(self, section5Df:pd.DataFrame):
        
        
        section5Data: List[Tuple] = []
        groupedSection5Df = section5Df.groupby("DATE_KEY")

        #iterating through each groups and appending required object into list
        for nameOfGroup,groupDf in groupedSection5Df:
            
            groupDf.reset_index(inplace=True, drop= True)
            # converting 20220307-> 2022-03-07
            dateKeyStr = str(nameOfGroup)
            dateKeyStr = dateKeyStr[:4]+ '-' + dateKeyStr[4:6] + '-' + dateKeyStr[6:]
            section5Obj = {"date": dateKeyStr}
            
            # deleting DATE_KEY column
            del groupDf['DATE_KEY']

             # convert each day values to list
            section5Dict = groupDf.to_dict(orient="index")
            section2ValList = list(section5Dict.values())
            section5Obj["values"] = section2ValList
            section5Data.append(section5Obj)
        return section5Data

       
    def fetchSection5Data(self, start_date: dt.datetime, end_date: dt.datetime):
       

        # converting datetime obj to string and then integer, 2021-08-16-> 20210816
        numbStartDate = int(start_date.strftime('%Y%m%d'))
        numbEndDate = int(end_date.strftime('%Y%m%d'))

        try:
            connection = cx_Oracle.connect(self.connString)
            cur = connection.cursor()
        except Exception as err:
            print('error while creating a connection/cursor', err)
        else:
            fetch_sql = '''SELECT fp.DATE_KEY , fp.FREQ6_VALUE AS less_than_Band, fp.FREQ7_VALUE AS Between_band, fp.FREQ8_VALUE AS greater_than_band, fpmm.MAX_FREQ , fpmm.MAX_TIME , fpmm.MIN_FREQ ,fpmm.MIN_TIME , fpmm.AVERAGE_FREQUENCY , fpmm.FREQ_VARIATION_INDEX, fpmm.STANDARD_DEVIATION  
                        FROM REPORTING_UAT.FREQUENCY_PROFILE fp   
                        INNER JOIN REPORTING_UAT.FREQUENCY_PROFILE_MAX_MIN fpmm 
                        ON fp.DATE_KEY  = fpmm.DATE_KEY WHERE fp.DATE_KEY BETWEEN :start_date AND :end_date order by fp.DATE_KEY'''

            section5Df = pd.read_sql(fetch_sql, params={'start_date': numbStartDate, 'end_date': numbEndDate}, con=connection)   
            section5Dfcopy = section5Df.copy()
            
        finally:
            if cur:
                cur.close()
            if connection:
                connection.close()
        
        section5freqProf = self.toListOfDict(section5Dfcopy)
        return section5freqProf