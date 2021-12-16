import pandas as pd
import datetime as dt
import cx_Oracle
from typing import List, Tuple


class OdUdDataFetcher():

    def __init__(self, connStr: str) -> None:
        """constructor

        Args:
            connStr (str): psp db connection string
        """
        self.connString = connStr

    def toDesiredFormat(self, respOdUdData:List[Tuple])->List[List]:
        odUdData: List[List] = [list(elem) for elem in respOdUdData]
        # converting 20211219->2021-12-19
        for elem in odUdData:
             elem[0] = str(dt.datetime.strptime(str(elem[0]), '%Y%m%d').date())
             for i in range(1, len(elem)):
                 elem[i] = round(elem[i], 1)
        return odUdData

    def fetchOdUdData(self, start_date: dt.datetime, end_date: dt.datetime, stateName: str)->List[List]:
        """fetch od ud data from psp database
        Args:
            start_date (dt.datetime): startdate
            end_date (dt.datetime): enddate
            stateName(str): stateName
        """

        # converting datetime obj to string and then integer, 2021-08-16-> 20210816
        numbStartDate = int(start_date.strftime('%Y%m%d'))
        numbEndDate = int(end_date.strftime('%Y%m%d'))
        respOdUdData: List[Tuple] = []
       
        try:
            connection = cx_Oracle.connect(self.connString)
        except Exception as err:
            print('error while creating a connection', err)
        else:
            try:
                cur = connection.cursor()

                fetch_sql = "SELECT date_key, drawal_schdule, actual_drawal, ui, availability, requirement, shortage, consumption FROM REPORTING_UAT.state_load_details where state_name = :stateName and date_key between  :start_date and :end_date order by date_key"
                # pspMetricDataDf = pd.read_sql(fetch_sql, params={'start_date': numbStartDate, 'end_date': numbEndDate}, con=connection)
                cur.execute(fetch_sql, {
                            'stateName': stateName, 'start_date': numbStartDate, 'end_date': numbEndDate})
                respOdUdData = cur.fetchall()
            except Exception as err:
                print('error while creating a cursor', err)
            else:
                connection.commit()
        finally:
            cur.close()
            connection.close()
        
        odUdData = self.toDesiredFormat(respOdUdData)
        return odUdData
