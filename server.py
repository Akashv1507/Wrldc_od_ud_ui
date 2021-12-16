from src.appConfig import loadAppConfig
from flask import Flask, jsonify, render_template
from src.fetchers.odUdDataFetcher import OdUdDataFetcher
from waitress import serve
from datetime import datetime as dt, timedelta
import warnings


warnings.filterwarnings("ignore")

app = Flask(__name__)

# get application config
appConfig = loadAppConfig()
app.config['SECRET_KEY'] = appConfig['flaskSecret']

conStr = appConfig['con_string_server_db']

obj_odUdDataFetcher = OdUdDataFetcher(connStr=conStr)
@app.route('/')
def home():
    return render_template('index.html.j2')

@app.route('/api/odUd/<startDate>/<endDate>/<stateName>')
def getOdUdData(startDate:str, endDate:str, stateName:str ):

    startDate = dt.strptime(startDate, '%Y-%m-%d')
    endDate = dt.strptime(endDate, '%Y-%m-%d')  
    odUdData = obj_odUdDataFetcher.fetchOdUdData(startDate, endDate, stateName)
    
    return jsonify({'odUdData':odUdData})
    
 

if __name__ == '__main__':
    serverMode: str = appConfig['mode']
    if serverMode.lower() == 'd':
        app.run(host="localhost", port=int(appConfig['flaskPort']), debug=True)
    else:
        serve(app, host='0.0.0.0', port=int(
            appConfig['flaskPort']),  threads=1)