# -*- coding: utf-8 -*-

import urllib2
import urllib
import serial
import time
import sys
import datetime
from xbee import XBee,ZigBee

cordinator = serial.Serial('COM5', 9600, timeout=1)
xbee = ZigBee(cordinator)

def main():
    try:
        host = 'xxx'

        while True:
            sensing_data = xbee.wait_read_frame()
            rf_data = sensing_data['rf_data'].rstrip()
            rf_list = rf_data.split(',')
            
            kind = int(rf_list[0])
            no = 1
            thermo = float(rf_list[1])
            hygro = float(rf_list[2])
            date = datetime.datetime.today().strftime('%Y/%m/%d %H:%M:%S')
            print date, kind, no, thermo, hygro

            params = urllib.urlencode({
                'kind' : int(rf_list[0]),
                'no' : 1,
                'thermo' : float(rf_list[1]),
                'hygro' : float(rf_list[2])
            })

            # サーバに送信
            res = urllib2.urlopen(host, params)

            if res.code != 200:
                print res.code, res.msg
            
            # 10分間隔で温湿度データを送信
            time.sleep(600)
    except KeyboardInterrupt:
        print u'キーボード処理により停止します。'
    except urllib2.HTTPError, e:
        print e.code, e.msg
    except urllib2.URLError, e:
        print e.code, e.msg
    finally:
        if xbee != None:
            xbee.halt()
        if cordinator != None:
            cordinator.close()

if __name__ == '__main__':
    main()