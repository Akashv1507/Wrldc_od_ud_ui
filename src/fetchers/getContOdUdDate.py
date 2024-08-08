import math
import pandas as pd
import numpy as np
import datetime as dt
from typing import List, Union
from src.fetchers.scadaAPiFetchers import ScadaApiFetcher
from src.helperFunctions import getTimeBlockNos
from src.typeDefinitions.deviationDtypes import IdevitionDtypes, IdevitionRespDtypes

class ContOdUdDataFetch():
    """class to fetch scada data from api and convert to blockwise continuous od and ud data
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
    
    def toBlockWiseData(self, entityDataDf:pd.core.frame.DataFrame)->pd.core.frame.DataFrame:
        
        try:
            entityDataDf = entityDataDf.resample('15min', on='timestamp').mean()  # this will set timestamp as index of dataframe
        except Exception as err:
            print('error while resampling', err)
        entityDataDf.reset_index(inplace=True)
        return entityDataDf

    def toDesiredFormat(self, actDataDf:pd.core.frame.DataFrame, schDataDf:pd.core.frame.DataFrame, blkNoList:List)->IdevitionRespDtypes:
        actDataDf.rename(columns = {'value':'actValue'}, inplace = True)
        schDataDf.rename(columns = {'value':'schValue'}, inplace = True)
        
        concatDf = pd.concat([actDataDf, schDataDf], axis=1)
        # here if endtime is 23:59 of current day and currTime id 10:30, blockNoList length will be 96, concatdf length will be 43(till now) hence error is thrown
        concatDf.insert(1, "block_no", blkNoList[:len(concatDf)]) 
        concatDf['deviation'] =  concatDf['actValue']- concatDf['schValue']
        concatDf['dummyVal'] = 0
        dummyVal =0
        concatDf['dummyVal'][0] = dummyVal
        prevDeviation = concatDf['deviation'][0]
        # print(concatDf)

        for ind in concatDf.index.tolist()[1:]:
            currDeviation = concatDf['deviation'][ind]
            if math.copysign(1, currDeviation) != math.copysign(1, prevDeviation):
                dummyVal = dummyVal+1
                concatDf['dummyVal'][ind] = dummyVal
                prevDeviation = currDeviation
            else:
                concatDf['dummyVal'][ind] = dummyVal
                prevDeviation = currDeviation
        #storing copy of concatDf
        newConcatDf = concatDf
        # group by based on dummy value inserted to identify continuous od and ud
        groupedContDeviation=newConcatDf.groupby("dummyVal")
        #iterating through each groups and appending required object into list
        odListObj:List[IdevitionDtypes]= []
        udListObj:List[IdevitionDtypes]= []
        deviationRespObj:IdevitionRespDtypes = {'odListObj':odListObj, 'udListObj':udListObj}

        for nameOfGroup,groupDf in groupedContDeviation:

            groupDf.reset_index(inplace=True, drop= True)
            lenOfGrp = len(groupDf)
            groupDf['Time'] = groupDf['timestamp'].dt.time.astype(str).str.slice(0,5)
            groupDf['BlockNo_Time']= groupDf['block_no'].map(str) + '(' + groupDf['Time'].map(str) + ')'
            
            dateKey = str(groupDf.iloc[0, :]['timestamp'].date())
            maxDeviation= round(groupDf['deviation'].max())
            minDeviation= round(groupDf['deviation'].min())
            avgDeviation= round(groupDf['deviation'].mean())
            fromTb = groupDf.iloc[0, :]['BlockNo_Time']
            toTb = groupDf.iloc[lenOfGrp-1, :]['BlockNo_Time']
            
            rowObj:IdevitionDtypes ={'date': dateKey,'fromTb':fromTb, 'toTb': toTb, 'avgDeviation': avgDeviation, 'maxDeviation':maxDeviation, 'minDeviation':minDeviation}  
            if avgDeviation>=0:
                odListObj.append(rowObj)
            else:
                udListObj.append(rowObj)

        return deviationRespObj
    
    def fetchContOdUdData(self, startTime: dt.datetime, endTime: dt.datetime, schScadaPointId:str, actScadaPointId:str)->IdevitionRespDtypes :
       
        obj_scadaApiFetcher = ScadaApiFetcher(self.tokenUrl, self.apiBaseUrl, self.clientId, self.clientSecret)
        deviationRespObj:IdevitionRespDtypes = {'odListObj':[], 'udListObj':[]}
        try:
            
            # fetching secondwise data from api for each entity(timestamp,value) and converting to dataframe
            schData = obj_scadaApiFetcher.fetchData(schScadaPointId, startTime, endTime)
            actData = obj_scadaApiFetcher.fetchData(actScadaPointId, startTime, endTime)

            schDataDf = pd.DataFrame(schData, columns =['timestamp','value'])
            actDataDf = pd.DataFrame(actData, columns =['timestamp','value']) 
            
            #converting to minutewise data
            schDataDf = self.toMinuteWiseData(schDataDf)
            actDataDf = self.toMinuteWiseData(actDataDf)

            #filtering demand between startTIme and endtime only
            schDataDf = schDataDf[(schDataDf['timestamp'] >= startTime) & (schDataDf['timestamp'] <= endTime)]
            actDataDf = actDataDf[(actDataDf['timestamp'] >= startTime) & (actDataDf['timestamp'] <= endTime)]
            
            # filling nan where value is zero
            schDataDf.loc[schDataDf['value'] == 0,'value'] = np.nan
            actDataDf.loc[actDataDf['value'] == 0,'value'] = np.nan
    
            # handling missing values NANs
            schDataDf['value'].fillna(method='ffill', inplace= True)
            schDataDf['value'].fillna(method='bfill', inplace= True)

            actDataDf['value'].fillna(method='ffill', inplace= True)
            actDataDf['value'].fillna(method='bfill', inplace= True)

            #converting to blockwise data
            schDataDf = self.toBlockWiseData(schDataDf)
            actDataDf = self.toBlockWiseData(actDataDf)
            schDataDf.drop(['timestamp'], axis=1, inplace=True)
            
            # getting list of block no. between startTime and endTime
            blkNoList = getTimeBlockNos(startTime, endTime)   

            deviationRespObj = self.toDesiredFormat(actDataDf, schDataDf, blkNoList)
          
        except Exception as err:
            print("error while fetching current ConOdUdData", err)
        finally:
            return deviationRespObj