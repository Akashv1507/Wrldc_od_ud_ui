import datetime as dt


def getNearestBlockTimeStamp(startTime: dt.datetime, endTime: dt.datetime):

    # startTime = dt.datetime.strptime(startTime, '%Y-%m-%d %H:%M:%S')
    # endTime = dt.datetime.strptime(endTime, '%Y-%m-%d %H:%M:%S')
    startTime = startTime.replace(second=0, microsecond=0)
    endTime = endTime.replace(second=0, microsecond=0)

    while (endTime.minute % 15) != 14:
        endTime = endTime + dt.timedelta(minutes=1)
    
    while (startTime.minute % 15) != 0:
        startTime = startTime - dt.timedelta(minutes=1)
    
    return {'newStartTime':startTime, 'newEndTime': endTime}

def getTimeBlockNos(startTime: dt.datetime, endTime: dt.datetime):
        dayStartTime = dt.datetime.strptime("2022-01-01 00:00:00", '%Y-%m-%d %H:%M:%S')
        dayEndTime = dt.datetime.strptime("2022-01-01 23:59:00", '%Y-%m-%d %H:%M:%S')

        if(startTime>endTime):
            return []
    
        blockCount = 0
        blksBwStartEndTime= []
        curTime = dayStartTime
        while(1):
            blockCount+=1
            if (curTime.time()>=startTime.time() and curTime.time()<=endTime.time()):
                blksBwStartEndTime.append(blockCount)
            curTime = curTime + dt.timedelta(minutes=15)
            if blockCount==96:
                break
        return blksBwStartEndTime