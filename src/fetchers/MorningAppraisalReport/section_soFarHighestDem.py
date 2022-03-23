import datetime as dt
from operator import imod
from typing import List, Tuple
import cx_Oracle
from src.helperFunctions import convertIntToDateStr



class SectionSoFarHighestDemFetcher():

    def __init__(self, connStr: str) -> None:
        """constructor

        Args:
            connStr (str): psp db connection string
        """
        self.connString = connStr

       
    def fetchSoFarHighestDemData(self, end_date: dt.datetime):
       
        # converting datetime obj to string and then integer, 2021-08-16-> 20210816
        
        numbEndDate = int(end_date.strftime('%Y%m%d'))
        entityList = [{'entityName':"WR", 'entityId':'WR'}, {'entityName':"GUJARAT", 'entityId':'Gujarat'}, {'entityName':"MADHYA PRADESH", 'entityId':'MP'}, {'entityName':"MAHARASHTRA", 'entityId':'Maharashtra'}, {'entityName':"CHHATTISGARH", 'entityId':'Chhattisgarh'}, {'entityName':"GOA", 'entityId':'Goa'}, {'entityName':"DAMAN AND DIU", 'entityId':'DD'}, {'entityName':"DNH", 'entityId':'DNH'}]
        entiyResultList = []
        srNo =1

        try:
            connection = cx_Oracle.connect(self.connString)
            cur = connection.cursor()
        except Exception as err:
            print('error while creating a connection/cursor', err)
        else:
            for entity in entityList:   
                fetch_SoFarMaxDemand_sql = '''SELECT date_key, state_name, max_demand FROM REPORTING_UAT.state_demand_requirement where max_demand = (select max(max_demand) FROM REPORTING_UAT.state_demand_requirement where date_key between 20190101 and :end_date and state_name =:state_name) '''
                cur.execute(fetch_SoFarMaxDemand_sql, {'end_date':numbEndDate , 'state_name': entity['entityName']})
                sofarMaxDemResult = cur.fetchall()
                entityObj = {'srNo':srNo,
                             'Entity':entity['entityId'],
                             'maxDem':sofarMaxDemResult[0][2],
                             'dateKey':convertIntToDateStr(sofarMaxDemResult[0][0])
                            }
                entiyResultList.append(entityObj)
                srNo= srNo+1
        finally:
            if cur:
                cur.close()
            if connection:
                connection.close()
        
        return entiyResultList