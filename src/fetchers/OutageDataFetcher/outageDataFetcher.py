import datetime as dt
from typing import List, Tuple
import cx_Oracle
import pandas as pd
from src.fetchers.OutageDataFetcher.outageDataFetcherSql import fetchOutageSql
from src.fetchers.OutageDataFetcher.IOutageObj import IOutageObj

class OutageDataFetcher():
    """class to fetch outage data
    """     
    connString:str = ''

    def __init__(self, connStr: str) -> None:
        """constructor

        Args:
            connStr (str): psp db connection string
        """
        self.connString = connStr

    def getOutageListObj (self, outageDataDf:pd.DataFrame)->List[IOutageObj] :
        if len(outageDataDf)>0:
            outageListData:List[IOutageObj] =[]
            for ind in outageDataDf.index:
                outageObj:IOutageObj = {}
                outageObj['elementName']=outageDataDf['ELEMENTNAME'][ind]
                outageObj['stateName']=outageDataDf['STATE_NAME'][ind]
                outageObj['owners']=outageDataDf['OWNERS'][ind]
                outageObj['stationName']=outageDataDf['STATION_NAME'][ind]
                outageObj['unitNo']=int(outageDataDf['UNIT_NUMBER'][ind])
                outageObj['installedCap']=float(outageDataDf['INSTALLED_CAPACITY'][ind])
                outageObj['classification']=outageDataDf['CLASSIFICATION'][ind]
                outageObj['outageDate']=str(outageDataDf['OUTAGE_DATE'][ind])[:10]
                outageObj['outageTime']=str(outageDataDf['OUTAGE_TIME'][ind])
                expDt = outageDataDf['EXPECTED_DATE'][ind]
                if pd.isna(expDt):
                    expDt = None
                else:
                    expDt = str(outageDataDf['EXPECTED_DATE'][ind])[:10]
                outageObj['expectedDate']=expDt
                outageObj['expectedTime']=outageDataDf['EXPECTED_TIME'][ind]
                outageObj['shutdownType']= outageDataDf['SHUT_DOWN_TYPE_NAME'][ind]
                outageObj['shutdownTag']=outageDataDf['SHUTDOWN_TAG'][ind]
                outageObj['reason']=outageDataDf['REASON'][ind]
                outageListData.append(outageObj)
            return outageListData


    def getOutageData (self, dateKey:str)->List[IOutageObj]:
        # dateKey is date till outage is fetched
       
        try:
            connection = cx_Oracle.connect(self.connString)
            cur = connection.cursor()
        except Exception as err:
            print('error while creating a connection/cursor', err)
        else:
            try:
                outageDataDf = pd.read_sql(fetchOutageSql, params={'datekey':dateKey }, con=connection)
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
        outageListObj = self.getOutageListObj(outageDataDf)
        return outageListObj