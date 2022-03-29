import datetime as dt
import requests
from typing import List, Tuple

class WbesDataFetcher():
    def __init__(self,user:str, password:str) -> None:
        """constructor   
        """
        self.user = user
        self.password = password
    
    def makeApiCall(self, dateKey:dt.datetime, parameterApiName:str, parameterName:str):
        dateStr = dt.datetime.strftime(dateKey, '%d-%m-%Y')
        url = f'https://wbes.wrldc.in/WebAccess/GetFilteredSchdData?USER={self.user}&PASS={self.password}&DATE={dateStr}&ACR={parameterApiName}'
        resp = requests.get(url)
        if not resp.status_code == 200:
            print(resp.status_code)
            print("unable to get data from wbes api")
            return []
        respJson = resp.json()
        paramsData = respJson["groupWiseDataList"][0]["netScheduleSummary"][parameterName].split(',')
        if len(paramsData) == 0:
            return []
        return paramsData
    
    def generateTimestampDay(self, dateKey:dt.datetime): 
        startTime = dateKey.replace(hour=0,minute=0, second=0)
        endTime = startTime+ dt.timedelta(hours=23, minutes=45)
        timestampList = []

        currTime = startTime
        while currTime<=endTime:
            timestampList.append(currTime)
            currTime = currTime + dt.timedelta(minutes=15)
        return timestampList

    def zipTwoList(self, list1:List, list2:List ):
        if len(list2)==len(list1):
            return list(zip(list1, list2))
        else:
             return []

    def filtereDataBwTimestmp(self, dataList:List[Tuple], startTime:dt.datetime, endTime:dt.datetime):
        
        if len(dataList)>0:
            filteredListTuple:List[Tuple]=[]
            for ele in dataList:
                if ele[0]>=startTime and ele[0]<=endTime:
                    newEle= (str(ele[0]), float(ele[1]))
                    filteredListTuple.append(newEle)
            return filteredListTuple
        else:
            return []
            
    def fetchDataWbesApi(self, parameterApiName:str, startTime:dt.datetime, endTime:dt.datetime):

        currDate = startTime.replace(hour=0, minute=0, second=0, microsecond=0)
        endDate = endTime.replace(hour=0, minute=0, second=0, microsecond=0)
        parRespData =[]
        while currDate<=endDate:
            apiData = self.makeApiCall(currDate, parameterApiName, 'NET_Total')
            timestampList = self.generateTimestampDay(currDate)
            respListTuple= self.zipTwoList(timestampList, apiData)
            parRespData = [*parRespData, *respListTuple]
            currDate = currDate+dt.timedelta(days=1)
        filteredDataList = self.filtereDataBwTimestmp(parRespData, startTime, endTime)
        return filteredDataList
    

    