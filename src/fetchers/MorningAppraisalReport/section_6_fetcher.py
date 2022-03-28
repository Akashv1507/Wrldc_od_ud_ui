from src.fetchers.MorningAppraisalReport.section_rrasSced_fetcher import SectionRrasScedDataFetcher
import datetime as dt

class Section6Fetcher(SectionRrasScedDataFetcher):
    def __init__(self, dbConStr:str, user:str, password:str) -> None:
        """constructor   
        """
        self.dbConStr = dbConStr
        # invoking constructor method of parent(SectionRrasScedDataFetcher) class
        SectionRrasScedDataFetcher.__init__(self, user, password)
    
    def fetchSection6Data(self, startDate:dt.datetime, endDate:dt.datetime):
        rrasScedData= self.fetchDataWbesApi(startDate, endDate)
        
        