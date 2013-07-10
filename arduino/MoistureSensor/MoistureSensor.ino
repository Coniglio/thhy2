#include <XBee.h>

#define MOISTURE_PIN 14 // ADC0
#define SENSOR "02"
#define ID "01"

char sendData[12] = {0};

XBee xbee = XBee();
XBeeAddress64 remoteAddress = XBeeAddress64(0x00000000, 0x00000000);
ZBTxRequest zbTx = ZBTxRequest(remoteAddress, (uint8_t *)sendData, sizeof(sendData));

void setup() {
  xbee.begin(9600);
}

void loop() {
  // 水分量を取得
  int moistureValue = analogRead(MOISTURE_PIN);
  
  // 水分量をフォーマット
  sendData[6] = 0;
  sendData[7] = 0;
  sendData[8] = 0;
  strcpy(sendData, SENSOR",");
  strcpy(&sendData[3], ID",");
  sprintf(&sendData[6], "%d", moistureValue);
  sendData[9] = 0x0d; // CR
  sendData[10] = 0x0a; // LN

  // 水分量を送信
  xbee.send(zbTx);

  // スリープ
  delay(60000);
}
