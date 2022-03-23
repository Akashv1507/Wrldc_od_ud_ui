import datetime as dt
from operator import imod
from typing import Dict, List, Tuple
from numpy import record
import pandas as pd
import cx_Oracle


class SectionStateDrawlFetcher():

    def __init__(self, connStr: str) -> None:
        """constructor

        Args:
            connStr (str): psp db connection string
        """
        self.connString = connStr
        self.fetch_stateDrawl_sql = '''SELECT state_name, DE_RTM_PXI as RTM, DE_PX as DAM, DE_BILT as BILT, DE_ISGS as "ISGS+LTA"  FROM REPORTING_UAT.STOA_DETAILS1 where date_key= :target_date order by state_name desc'''
       
    def fetchStateDrawlData(self, targetDate: dt.datetime):
       
        # converting datetime obj to string and then integer, 2021-08-16-> 20210816
        numbTargetDate = int(targetDate.strftime('%Y%m%d'))

        try:
            connection = cx_Oracle.connect(self.connString)
            cur = connection.cursor()
        except Exception as err:
            print('error while creating a connection/cursor', err)
        else:
            stateDrawlDf = pd.read_sql(self.fetch_stateDrawl_sql, params={'target_date':numbTargetDate}, con=connection) 
            stateDrawlDf.set_index('STATE_NAME', inplace=True)
            transposeStateDrawlDf= stateDrawlDf.T
            transposeStateDrawlDf.rename_axis('METRIC', inplace=True)
            transposeStateDrawlDf.reset_index(inplace=True)
        finally:
            if cur:
                cur.close()
            if connection:
                connection.close()
        return transposeStateDrawlDf
    
    def fetchStateDrawlTblData(self, targetDate: dt.datetime):

        transposeStateDrawlDf= self.fetchStateDrawlData(targetDate)
        stateDrawlTblData: List[Dict] = transposeStateDrawlDf.to_dict('records')
        return stateDrawlTblData
    
    def fetchStateDrawlPlotData(self, targetDate: dt.datetime):

        stateDrawlPlotData = {}
        transposeStateDrawlDf= self.fetchStateDrawlData(targetDate)

        # converting each value to its percentage
        for col in transposeStateDrawlDf.columns.to_list()[1:]:

            # getting absolute sum of df column
            sum=0
            for ind in transposeStateDrawlDf.index:
                if transposeStateDrawlDf[col][ind]>=0:
                    sum= sum + transposeStateDrawlDf[col][ind]
                else:
                    sum= sum + (transposeStateDrawlDf[col][ind]*-1)

            for ind in transposeStateDrawlDf.index:
                transposeStateDrawlDf[col][ind]= (transposeStateDrawlDf[col][ind]/sum)*100

        for ind in transposeStateDrawlDf.index:
            stateDrawlPlotData[transposeStateDrawlDf['METRIC'][ind]]=[{'parName': 'Mah', 'value':round(transposeStateDrawlDf['MAHARASHTRA'][ind],2), 'legName':transposeStateDrawlDf['METRIC'][ind]},
                                                                    {'parName': 'MP', 'value':round(transposeStateDrawlDf['MADHYA PRADESH'][ind],2), 'legName':transposeStateDrawlDf['METRIC'][ind]},
                                                                    {'parName': 'Guj', 'value':round(transposeStateDrawlDf['GUJARAT'][ind],2), 'legName':transposeStateDrawlDf['METRIC'][ind]},
                                                                    {'parName': 'Goa', 'value':round(transposeStateDrawlDf['GOA'][ind],2), 'legName':transposeStateDrawlDf['METRIC'][ind]},
                                                                    {'parName': 'DD', 'value':round(transposeStateDrawlDf['DAMAN AND DIU'][ind],2), 'legName':transposeStateDrawlDf['METRIC'][ind]},
                                                                    {'parName': 'DNH', 'value':round(transposeStateDrawlDf['DADRA AND NAGAR HAVELI'][ind],2), 'legName':transposeStateDrawlDf['METRIC'][ind]},
                                                                    {'parName': 'Chatt', 'value':round(transposeStateDrawlDf['CHHATTISGARH'][ind],2), 'legName':transposeStateDrawlDf['METRIC'][ind]},
                                                                    {'parName': 'AMNSIL', 'value':round(transposeStateDrawlDf['AMNSIL'][ind],2), 'legName':transposeStateDrawlDf['METRIC'][ind]}]
        
        return stateDrawlPlotData