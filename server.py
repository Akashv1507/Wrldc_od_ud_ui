from src.appConfig import loadAppConfig
from flask import Flask, jsonify, render_template
from src.fetchers.odUdDataFetcher import OdUdDataFetcher
from src.fetchers.fetchScadaPointsApi import DataFetchFromApi
from src.fetchers.getContOdUdDate import ContOdUdDataFetch
from src.fetchers.FreqAndCorrDevDataFetcher import FreqAndCorrDevDataFetch
from src.helperFunctions import getNearestBlockTimeStamp
from waitress import serve
from datetime import datetime as dt, timedelta
import warnings


warnings.filterwarnings("ignore")

app = Flask(__name__)

# get application config
appConfig = loadAppConfig()
app.config['SECRET_KEY'] = appConfig['flaskSecret']

conStr = appConfig['con_string_server_db']
tokenUrl = appConfig['tokenUrl']
apiBaseUrl= appConfig['apiBaseUrl']
clientId=appConfig['clientId']
clientSecret=appConfig['clientSecret']

obj_odUdDataFetcher = OdUdDataFetcher(connStr=conStr)
obj_dataFetchFromApi = DataFetchFromApi(tokenUrl, apiBaseUrl, clientId, clientSecret)
obj_contOdUdDataFetch= ContOdUdDataFetch(tokenUrl, apiBaseUrl, clientId, clientSecret)
obj_freqAndCorrDevDataFetch= FreqAndCorrDevDataFetch(tokenUrl, apiBaseUrl, clientId, clientSecret)


@app.route('/')
def index():
    return render_template('index.html.j2')

@app.route('/odUdUi')
def odUdUiIndex():
    return render_template('odUdUiIndex.html.j2')

@app.route('/schVsActDrawl')
def schVsActDrawlIndex():
    return render_template('schVsActDrawlIndex.html.j2')

@app.route('/api/odUd/<startDate>/<endDate>/<stateName>')
def getOdUdData(startDate:str, endDate:str, stateName:str ):

    startDate = dt.strptime(startDate, '%Y-%m-%d')
    endDate = dt.strptime(endDate, '%Y-%m-%d')  
  
    odUdData = obj_odUdDataFetcher.fetchOdUdData(startDate, endDate, stateName) 
    return jsonify({'odUdData':odUdData})

@app.route('/api/schVsActDrawl/<startDate>/<endDate>/<scadaPointName>')
def getSchVsActDrawl(startDate:str, endDate:str, scadaPointName:str ):
    
    startTime = dt.strptime(startDate, '%Y-%m-%d %H:%M:%S')
    endTime = dt.strptime(endDate, '%Y-%m-%d %H:%M:%S')  
   
    scadaPointId = appConfig[scadaPointName]
    schVsActDrawl = obj_dataFetchFromApi.fetchEntityDataFromApi(startTime, endTime, scadaPointId)
  
    return jsonify({'schVsActDrawlData':schVsActDrawl})

@app.route('/api/contOdUd/<startDate>/<endDate>/<stateName>')
def getContOdUd(startDate:str, endDate:str, stateName:str ):
    
    startTime = dt.strptime(startDate, '%Y-%m-%d %H:%M:%S')
    endTime = dt.strptime(endDate, '%Y-%m-%d %H:%M:%S') 
    # converting startime and endtime to nearest block starttime and endtime
    newTimes= getNearestBlockTimeStamp(startTime, endTime) 
    startTime = newTimes['newStartTime']
    endTime = newTimes['newEndTime']

    stateSchName = stateName+ '_Schedule'
    stateActName = stateName+ '_Actual'
    schScadaPointId = appConfig[stateSchName]
    actScadaPointId = appConfig[stateActName]
    deviationRespObj = obj_contOdUdDataFetch.fetchContOdUdData(startTime, endTime, schScadaPointId, actScadaPointId )
    return jsonify(deviationRespObj)
    
@app.route('/api/wrFreq_Dev/<startDate>/<endDate>/')
def getWrFreqDevData(startDate:str, endDate:str ):
    
    startTime = dt.strptime(startDate, '%Y-%m-%d %H:%M:%S')
    endTime = dt.strptime(endDate, '%Y-%m-%d %H:%M:%S') 
    # converting startime and endtime to nearest block starttime and endtime
    newTimes= getNearestBlockTimeStamp(startTime, endTime) 
    startTime = newTimes['newStartTime']
    endTime = newTimes['newEndTime']

    freqCorrDevRespObj = obj_freqAndCorrDevDataFetch.fetchApiData(startTime, endTime)
    return jsonify(freqCorrDevRespObj)
    
if __name__ == '__main__':
    serverMode: str = appConfig['mode']
    if serverMode.lower() == 'd':
        app.run(host="localhost", port=int(appConfig['flaskPort']), debug=True)
    else:
        serve(app, host='0.0.0.0', port=int(
            appConfig['flaskPort']),  threads=1)