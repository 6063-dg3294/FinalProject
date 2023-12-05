void setup() {
  Serial.begin(9600);
  

}

void loop() {
  int a0v = analogRead(A0);

  Serial.println(a0v);
  delay(10);

}
