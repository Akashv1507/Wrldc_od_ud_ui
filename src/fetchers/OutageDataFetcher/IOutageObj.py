from typing import List, TypedDict

class IOutageObj(TypedDict):
    elementName:str
    stateName:str
    owners:str
    stationName:str
    stationType:str
    unitNo:int
    installedCap: int
    classification: str
    outageDate:str
    outageTime:str
    expectedDate:str
    expectedTime:str
    shutdownType:str
    shutdownTag:str
    reason:str
   
# class IOutageData(TypedDict):
#     outageDataList : IOutageObj[List]
