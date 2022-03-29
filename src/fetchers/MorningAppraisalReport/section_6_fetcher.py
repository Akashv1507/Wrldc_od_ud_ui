from src.fetchers.MorningAppraisalReport.section_rrasSced_fetcher import SectionRrasScedDataFetcher
import datetime as dt

# inheriting SectionRrasScedDataFetcher class
class Section6Fetcher(SectionRrasScedDataFetcher):
    def __init__(self, dbConStr:str, user:str, password:str) -> None:
        """constructor   
        """
        self.dbConStr = dbConStr
        # invoking constructor method of parent(SectionRrasScedDataFetcher) class
        SectionRrasScedDataFetcher.__init__(self, user, password)
    
    def fetchSection6Data(self, startDate:dt.datetime, endDate:dt.datetime):

        rrasScedData= self.fetchDataWbesApi(startDate, endDate)
        section6DataList = []

        for rrasScedObj in rrasScedData:
            dateKey = rrasScedObj["dateKey"]
            rrasUp = 0
            rrasDwn = 0
            countRrasUp = 0
            countRrasDwn = 0
            scedUp = 0
            scedDwn = 0
            countScedUp =0
            countScedDwn=0
            section6obj = {'dateKey': dateKey, 'rras':0, 'rrasUp':0, 'rrasDwn':0, 'sced':0, 'scedUp':0, 'scedDwn':0}
            try:
                for rrasEle in rrasScedObj['rras']:
                    if float(rrasEle[1][:])>0:
                        rrasUp= rrasUp + float(rrasEle[1])
                        countRrasUp = countRrasUp+1
                    elif float(rrasEle[1])<0:
                        rrasDwn= rrasDwn + float(rrasEle[1])
                        countRrasDwn = countRrasDwn +1

                for scedEle in rrasScedObj['sced']:
                    if float(scedEle[1])>0:
                        scedUp= scedUp + float(scedEle[1])
                        countScedUp = countScedUp+1
                    elif float(scedEle[1])<0:
                        scedDwn= scedDwn + float(scedEle[1])
                        countScedDwn = countScedDwn +1
                
                rrasUpMu = 0 if not countRrasUp else ((rrasUp/countRrasUp)*(countRrasUp*15))/(60*1000)
                rrasDwnMu = 0 if not countRrasDwn else((rrasDwn/countRrasDwn)*(countRrasDwn*15))/(60*1000) 
                rras = rrasDwnMu+rrasUpMu

                scedUpMu = 0 if not countScedUp else ((scedUp/countScedUp)*(countScedUp*15))/(60*1000)
                scedDwnMu = 0 if not countScedDwn else((scedDwn/countScedDwn)*(countScedDwn*15))/(60*1000) 
                sced = scedDwnMu+scedUpMu

                section6obj = {'dateKey': dateKey, 'rras':round(rras,2), 'rrasUp':round(rrasUpMu,2), 'rrasDwn':round(rrasDwnMu,2), 'sced':round(sced,2), 'scedUp':round(scedUpMu,2), 'scedDwn':round(scedDwnMu,2)}

            except Exception as err:
                print('Error while calculating RRAS SCED data', err)
            finally:
                section6DataList.append(section6obj)
        return section6DataList
            





        
        