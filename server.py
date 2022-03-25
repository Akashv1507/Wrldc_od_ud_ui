from src.appConfig import loadAppConfig
from flask import Flask, jsonify, render_template
from src.fetchers.odUdDataFetcher import OdUdDataFetcher
from src.fetchers.fetchScadaPointsApi import DataFetchFromApi
from src.fetchers.getContOdUdDate import ContOdUdDataFetch
from src.fetchers.FreqAndCorrDevDataFetcher import FreqAndCorrDevDataFetch
from src.fetchers.MorningAppraisalReport.section_1_fetcher import Section1Fetcher
from src.fetchers.MorningAppraisalReport.section_2_fetcher import Section2Fetcher
from src.fetchers.MorningAppraisalReport.section_3_fetcher import Section3Fetcher
from src.fetchers.MorningAppraisalReport.section_5_fetcher import Section5Fetcher
from src.fetchers.MorningAppraisalReport.section_7_damRtm_fetcher import Section7Fetcher
from src.fetchers.MorningAppraisalReport.section_state_fetcher import SectionStateFetcher
from src.fetchers.MorningAppraisalReport.section_istsRe_fetcher import SectionIstsReFetcher
from src.fetchers.MorningAppraisalReport.section_freqProfile_fetcher import SectionFreqProfileFetcher
from src.fetchers.MorningAppraisalReport.section_genPlotData_fetcher import SectionGenPlotDataFetcher
from src.fetchers.MorningAppraisalReport.section_soFarHighestDem import SectionSoFarHighestDemFetcher
from src.fetchers.MorningAppraisalReport.section_stateDrawlFetcher import SectionStateDrawlFetcher
from src.fetchers.MorningAppraisalReport.section_damRtmPlotData_fetcher import SectionDamRtmPlotDataFetcher
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
moDbConStr = appConfig['moDbConnStr']
tokenUrl = appConfig['tokenUrl']
apiBaseUrl= appConfig['apiBaseUrl']
clientId=appConfig['clientId']
clientSecret=appConfig['clientSecret']

obj_odUdDataFetcher = OdUdDataFetcher(connStr=conStr)
obj_dataFetchFromApi = DataFetchFromApi(tokenUrl, apiBaseUrl, clientId, clientSecret)
obj_contOdUdDataFetch= ContOdUdDataFetch(tokenUrl, apiBaseUrl, clientId, clientSecret)
obj_freqAndCorrDevDataFetch= FreqAndCorrDevDataFetch(tokenUrl, apiBaseUrl, clientId, clientSecret)
obj_section1Fetcher = Section1Fetcher(connStr=conStr)
obj_section2Fetcher = Section2Fetcher(connStr=conStr)
obj_section3Fetcher = Section3Fetcher(connStr=conStr)
obj_section5Fetcher = Section5Fetcher(connStr=conStr)
obj_section7Fetcher = Section7Fetcher(connStr=moDbConStr)
obj_sectionStateFetcher = SectionStateFetcher(connStr=conStr)
obj_sectionIstsReFetcher = SectionIstsReFetcher(connStr=conStr)
obj_sectionFreqProfileFetcher = SectionFreqProfileFetcher(connStr=conStr)
obj_sectionGenPlotDataFetcher = SectionGenPlotDataFetcher(connStr=conStr)
obj_sectionSoFarHighestDemFetcher = SectionSoFarHighestDemFetcher(connStr=conStr)
obj_sectionStateDrawlFetcher = SectionStateDrawlFetcher(connStr=conStr)
obj_sectionDamRtmPlotDataFetcher = SectionDamRtmPlotDataFetcher(connStr=moDbConStr)

@app.route('/')
def index():
    return render_template('index.html.j2')

@app.route('/odUdUi')
def odUdUiIndex():
    return render_template('odUdUiIndex.html.j2')

@app.route('/schVsActDrawl')
def schVsActDrawlIndex():
    return render_template('schVsActDrawlIndex.html.j2')

@app.route('/mornAppraisalRep')
def morningAppraisalReport():
    return render_template('morningReportIndex.html.j2')

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

@app.route('/generteMorningReport/<targetDate>/')
def generateMorningReport(targetDate:str ):

    # endDate will be targetDate and startDate will be previous date
    endDate = dt.strptime(targetDate, '%Y-%m-%d')
    startDate = endDate - timedelta(days=1)

    section1Data = obj_section1Fetcher.fetchSection1Data(startDate, endDate)
    section2Data = obj_section2Fetcher.fetchSection2Data(startDate, endDate)
    section3Data = obj_section3Fetcher.fetchSection3Data(startDate, endDate)
    sectio5Data = obj_section5Fetcher.fetchSection5Data(startDate, endDate)
    section7Data = obj_section7Fetcher.fetchSection7Data(startDate, endDate)
    sectionSoFarHighestData = obj_sectionSoFarHighestDemFetcher.fetchSoFarHighestDemData(endDate)
    return render_template('reportTemplate.html.j2', reportDate= targetDate, section1ConsumpData = section1Data, section2MaxData = section2Data["section2MaxData"], section2DiffData = section2Data["section2DiffData"], section3Data =section3Data, section5freqProf = sectio5Data, sectionSoFarHighestData= sectionSoFarHighestData, section7Data=section7Data )

@app.route('/getStateReData/<targetDate>/')
def getStateReData(targetDate:str ):

    # endDate will be targetDate and startDate will be previous date
    endDate = dt.strptime(targetDate, '%Y-%m-%d')
    startDate = endDate - timedelta(days=1)

    sectionStateData = obj_sectionStateFetcher.fetchSectionStateData(startDate, endDate)
    return jsonify({'stateReData':sectionStateData})

@app.route('/getIstsReData/<targetDate>/')
def getIstsReData(targetDate:str ):

    # endDate will be targetDate and startDate will be previous date
    endDate = dt.strptime(targetDate, '%Y-%m-%d')
    startDate = endDate - timedelta(days=1)

    istsReData = obj_sectionIstsReFetcher.fetchSectionIstsReData(startDate, endDate)
    return jsonify(istsReData)

@app.route('/getFreqProfPlotData/<targetDate>/')
def getFreqProfPlotData(targetDate:str ):

    # endDate will be targetDate and startDate will be previous date
    endDate = dt.strptime(targetDate, '%Y-%m-%d')
    startDate = endDate - timedelta(days=2)

    freProfData = obj_sectionFreqProfileFetcher.fetchSectionFreqProfilePlotData(startDate, endDate)
    return jsonify(freProfData)

@app.route('/getGenPlotData/<targetDate>/')
def getGenPlotData(targetDate:str ):

    # endDate will be targetDate and startDate will be previous date
    endDate = dt.strptime(targetDate, '%Y-%m-%d')
    startDate = endDate - timedelta(days=2)

    genPlotData = obj_sectionGenPlotDataFetcher.fetchGenPlotDataData(startDate, endDate)
    return jsonify(genPlotData)

@app.route('/getStateDrawlTblData/<targetDate>/')
def getStateDrawlTblData(targetDate:str ):

    # target date is report date
    targetDate = dt.strptime(targetDate, '%Y-%m-%d')
    
    stateDrawlMixTblData = obj_sectionStateDrawlFetcher.fetchStateDrawlTblData(targetDate)
    return render_template('stateDrawlMixTemplate.html.j2',stateDrawlMixTblData= stateDrawlMixTblData)

@app.route('/getStateDrawlPlotData/<targetDate>/')
def getStateDrawlPlotData(targetDate:str ):

    # target date is report date
    targetDate = dt.strptime(targetDate, '%Y-%m-%d')
    
    stateDrawlMixPlotData = obj_sectionStateDrawlFetcher.fetchStateDrawlPlotData(targetDate)
    return jsonify(stateDrawlMixPlotData)

@app.route('/getDamRtmPlotData/<targetDate>/')
def getDamRtmPlotData(targetDate:str ):

    # endDate will be targetDate and startDate will be previous date
    endDate = dt.strptime(targetDate, '%Y-%m-%d')
    startDate = endDate - timedelta(days=1)
    damRtmPlotData = obj_sectionDamRtmPlotDataFetcher.fetchDamRtmPlotData(startDate, endDate)
    return jsonify(damRtmPlotData)
    
    
if __name__ == '__main__':
    serverMode: str = appConfig['mode']
    if serverMode.lower() == 'd':
        app.run(host="localhost", port=int(appConfig['flaskPort']), debug=True)
    else:
        serve(app, host='0.0.0.0', port=int(
            appConfig['flaskPort']),  threads=1)