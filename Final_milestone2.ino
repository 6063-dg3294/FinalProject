void setup() {
  Serial.begin(9600);

}

void loop() {
  int a0v = analogRead(A0);

  if(Serial.available() > 0){
    int inByte = Serial.read();
    if (inByte == 10){
        Serial.println(a0v);
    }
  }

  delay(10);

}
