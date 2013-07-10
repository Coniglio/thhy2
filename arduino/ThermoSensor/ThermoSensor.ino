void setup() {
 analogReference(INTERNAL);
 Serial.begin(9600);
}

void loop() {
  int val;
  double volt;
  double thermo;
  char sendStr[6];

  val = analogRead(0); 
  volt = 1.1 * val / 1024.0;
  thermo = (volt - 0.6) * 100.0;

  float thermoAbs = abs(thermo);
  int thermoInt = (int)thermo;
  int thermoTen = abs((thermo - (double)thermoInt) * 10);
  int index = 0;
  
  if (0 < thermo) {
    sendStr[index++] = ' ';
    if (thermo < 10) {
      sendStr[index++] = ' ';
    }
  } else {
    if (thermoAbs < 10) {
      sendStr[index++] = ' ';
    }
    
    if ((thermo < 0) && (thermoInt == 0)) {
      sendStr[index++] = '-';
    } else if (thermo == 0.0) {
      sendStr[index++] = ' ';
    }
  }
  
  sprintf(&sendStr[index], "%2d.%1d", thermoInt, thermoTen);
  //sendStr[5] = 0x0d;
  //sendStr[6] = 0x0a;
  
  Serial.print(sendStr);

  delay(600000);
}
