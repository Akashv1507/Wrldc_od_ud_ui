from typing import List, TypedDict


class IdevitionDtypes(TypedDict):
    date:str
    fromTb:str
    toTb:str
    maxDeviation: int
    minDeviation: int
    avgDeviation: int

class IdevitionRespDtypes(TypedDict):
    odListObj:List[IdevitionDtypes] 
    udListObj:List[IdevitionDtypes]