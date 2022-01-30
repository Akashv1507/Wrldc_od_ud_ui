import pandas as pd
import numpy as np
import datetime as dt
from typing import List, Tuple, TypedDict, Union
from src.fetchers.scadaAPiFetchers import ScadaApiFetcher

class DataFetchFromApi():
    """class to fetch scada data frrom api
    """   
    tokenUrl: str = ''
    apiBaseUrl: str = ''
    clientId: str = ''
    clientSecret: str = ''

    def __init__(self, tokenUrl, apiBaseUrl, clientId, clientSecret):
        self.tokenUrl = tokenUrl
        self.apiBaseUrl = apiBaseUrl
        self.clientId = clientId
        self.clientSecret = clientSecret
    
    def toMinuteWiseData(self, entityDataDf:pd.core.frame.DataFrame)->pd.core.frame.DataFrame:
        
        try:
            entityDataDf = entityDataDf.resample('1min', on='timestamp').agg({'value': 'first'})  # this will set timestamp as index of dataframe
        except Exception as err:
            print('error while resampling', err)
        entityDataDf.reset_index(inplace=True)
        return entityDataDf


    def toListOfTuple(self, df:pd.core.frame.DataFrame) -> List[Union[dt.datetime, float]]:
         
        data:List[List] = []
        for ind in df.index:
            tempList = [str(df['timestamp'][ind]), float(df['value'][ind]) ]
            data.append(tempList)
        return data

    def fetchEntityDataFromApi(self, startTime: dt.datetime, endTime: dt.datetime, entityTag:str)-> List[Union[dt.datetime, float]] :
       
        entityDataDf = pd.DataFrame(columns = [ 'timestamp','value']) 
        #creating object of ScadaApiFetcher class 
        obj_scadaApiFetcher = ScadaApiFetcher(self.tokenUrl, self.apiBaseUrl, self.clientId, self.clientSecret)
        
        try:
            # fetching secondwise data from api for each entity(timestamp,value) and converting to dataframe
            resData = obj_scadaApiFetcher.fetchData(entityTag, startTime, endTime)
          
        except Exception as err:
            print("error while fetching current demand", err)
        else:
            entityDataDf = pd.DataFrame(resData, columns =['timestamp','value']) 
            
            #converting to minutewise data
            entityDataDf = self.toMinuteWiseData(entityDataDf)
            #filtering demand between startTIme and endtime only
            entityDataDf = entityDataDf[(entityDataDf['timestamp'] >= startTime) & (entityDataDf['timestamp'] <= endTime)]

            # filling nan where value is zero
            entityDataDf.loc[entityDataDf['value'] == 0,'value'] = np.nan
    
            # handling missing values NANs
            entityDataDf['value'].fillna(method='ffill', inplace= True)
            entityDataDf['value'].fillna(method='bfill', inplace= True)
        finally:
            data : List[Union[dt.datetime, float]] = self.toListOfTuple(entityDataDf)
       
        return data