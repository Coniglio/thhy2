#include "DHT.h"

#define DHTPIN 2

#define DHTTYPE DHT11   // DHT 11 

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600); 
  dht.begin();
}

void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (! isnan(t) && ! isnan(h)) {
    Serial.print("2,1,"); 
    Serial.print(t);
    Serial.print(",");
    Serial.println(h);
  }
  
  delay(600000);
}
