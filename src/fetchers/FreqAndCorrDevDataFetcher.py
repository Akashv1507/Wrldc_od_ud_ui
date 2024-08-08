import math
import pandas as pd
import numpy as np
import datetime as dt
from typing import List, Union
from src.fetchers.scadaAPiFetchers import ScadaApiFetcher
from src.helperFunctions import getTimeBlockNos, getListofPointDict
from src.appConfig import getAppConfigDict

class FreqAndCorrDevDataFetch():
    """class to fetch scada data from api and get min/max frequency & corresponding deviation
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
    
    def toMinuteWiseData(self, entityDataDf:pd.core.frame.DataFrame, valColName='value')->pd.core.frame.DataFrame:
        
        try:
            entityDataDf = entityDataDf.resample('1min', on='timestamp').agg({f'{valColName}': 'first'})  # this will set timestamp as index of dataframe
        except Exception as err:
            print('error while resampling', err)
        entityDataDf.reset_index(inplace=True)
        return entityDataDf

    def fetchEntityData(self, startTime: dt.datetime, endTime: dt.datetime, entityScadaPoint:str, entityName:str):
       
        obj_scadaApiFetcher = ScadaApiFetcher(self.tokenUrl, self.apiBaseUrl, self.clientId, self.clientSecret)
        
        try:  
            # fetching secondwise data from api for each entity(timestamp,value) and converting to dataframe
            entityScadaPointData = obj_scadaApiFetcher.fetchData(entityScadaPoint, startTime, endTime)           
            entityScadaPointDataDf = pd.DataFrame(entityScadaPointData, columns =['timestamp', f'{entityName}_value'])
            
            #converting to minutewise data
            entityScadaPointDataDf = self.toMinuteWiseData(entityScadaPointDataDf, f'{entityName}_value')

            #filtering demand between startTIme and endtime only
            entityScadaPointDataDf = entityScadaPointDataDf[(entityScadaPointDataDf['timestamp'] >= startTime) & (entityScadaPointDataDf['timestamp'] <= endTime)]
            
            # filling nan where value is zero
            entityScadaPointDataDf.loc[entityScadaPointDataDf[f'{entityName}_value'] == 0,f'{entityName}_value'] = np.nan
            
            # handling missing values NANs
            entityScadaPointDataDf[f'{entityName}_value'].fillna(method='ffill', inplace= True)
            entityScadaPointDataDf[f'{entityName}_value'].fillna(method='bfill', inplace= True)

            return entityScadaPointDataDf
          
        except Exception as err:
            print("error while fetching current demand", err)
            emptyDf = pd.DataFrame()
            return emptyDf

    def fetchSchActData(self, startTime: dt.datetime, endTime: dt.datetime, actScadaPointId:str, schScadaPointId:str, stateName:str):
       
        obj_scadaApiFetcher = ScadaApiFetcher(self.tokenUrl, self.apiBaseUrl, self.clientId, self.clientSecret)
        
        try:  
            # fetching secondwise data from api for each entity(timestamp,value) and converting to dataframe
            schScadaPointData = obj_scadaApiFetcher.fetchData(schScadaPointId, startTime, endTime)
            actScadaPointData = obj_scadaApiFetcher.fetchData(actScadaPointId, startTime, endTime)
            
            schScadaPointDataDf = pd.DataFrame(schScadaPointData, columns =['timestamp', 'value'])
            actScadaPointDataDf = pd.DataFrame(actScadaPointData, columns =['timestamp', 'value'])
            deviationDataDf = pd.DataFrame(columns =['timestamp', f'{stateName}_dev'])
            #converting to minutewise data
            schScadaPointDataDf = self.toMinuteWiseData(schScadaPointDataDf)
            actScadaPointDataDf = self.toMinuteWiseData(actScadaPointDataDf)
            
            # creating new deviation data df
            deviationDataDf['timestamp'] = actScadaPointDataDf['timestamp']
            deviationDataDf[f'{stateName}_dev'] = actScadaPointDataDf['value']-schScadaPointDataDf['value']

            #filtering demand between startTIme and endtime only
            deviationDataDf = deviationDataDf[(deviationDataDf['timestamp'] >= startTime) & (deviationDataDf['timestamp'] <= endTime)]
            
            # filling nan where value is zero
            deviationDataDf.loc[deviationDataDf[f'{stateName}_dev'] == 0,f'{stateName}_dev'] = np.nan
            
            # handling missing values NANs
            deviationDataDf[f'{stateName}_dev'].fillna(method='ffill', inplace= True)
            deviationDataDf[f'{stateName}_dev'].fillna(method='bfill', inplace= True)

            return deviationDataDf[f'{stateName}_dev']
          
        except Exception as err:
            print("error while fetching Freq and Corr Dev Api data", err)
            emptyDf = pd.DataFrame()
            return emptyDf

    def fetchApiData(self, startTime: dt.datetime, endTime: dt.datetime):

        appConfig = getAppConfigDict()
        
        entityObj = {'entityId':appConfig["Frequency"], 'entityName':"Frequency"}
    
        statePointListDict= getListofPointDict()
       
        freqDf = self.fetchEntityData(startTime, endTime, entityObj['entityId'], entityObj['entityName'])
        # initializing concatDf with freqDf
        concatDf = freqDf
        for statePoint in statePointListDict:
            stateDevDf = self.fetchSchActData(startTime, endTime,  statePoint['actual'], statePoint['schedule'], statePoint['stateName'])
            concatDf = pd.concat([concatDf, stateDevDf], axis=1)

        maxFreq = concatDf['Frequency_value'].max()
        minFreq = concatDf['Frequency_value'].min()
        
        maxDataDf = concatDf[concatDf['Frequency_value']==maxFreq]
        minDataDf = concatDf[concatDf['Frequency_value']==minFreq]

        maxDataDf['date'] = maxDataDf['timestamp'].dt.date
        maxDataDf['time'] = maxDataDf['timestamp'].dt.time

        minDataDf['date'] = minDataDf['timestamp'].dt.date
        minDataDf['time'] = minDataDf['timestamp'].dt.time

        maxDataDf.reset_index(inplace = True, drop = True)
        minDataDf.reset_index(inplace = True, drop = True)

        maxFreqAndCorrDev = {'date':str(maxDataDf['date'][0]), 'time':str(maxDataDf['time'][0]), 'freq':round(maxDataDf['Frequency_value'][0],3), 'gujDev':round(maxDataDf['Gujarat_dev'][0]), 'mahDev':round(maxDataDf['Maharashtra_dev'][0]), 'mpDev':round(maxDataDf['MP_dev'][0]), 'chattDev':round(maxDataDf['Chattishgarh_dev'][0]), 'goaDev':round(maxDataDf['Goa_dev'][0]), 'ddDev':round(maxDataDf['DD_dev'][0]), 'dnhDev':round(maxDataDf['DNH_dev'][0]) }
        minFreqAndCorrDev = {'date':str(minDataDf['date'][0]), 'time':str(minDataDf['time'][0]), 'freq':round(minDataDf['Frequency_value'][0],3), 'gujDev':round(minDataDf['Gujarat_dev'][0]), 'mahDev':round(minDataDf['Maharashtra_dev'][0]), 'mpDev':round(minDataDf['MP_dev'][0]), 'chattDev':round(minDataDf['Chattishgarh_dev'][0]), 'goaDev':round(minDataDf['Goa_dev'][0]), 'ddDev':round(minDataDf['DD_dev'][0]), 'dnhDev':round(minDataDf['DNH_dev'][0]) }
        
        freqAndCorrDevObj = {'maxFreqAndCorrDev':maxFreqAndCorrDev, 'minFreqAndCorrDev':minFreqAndCorrDev}

        return freqAndCorrDevObj