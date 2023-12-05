let mSerial;

function connect(){
  mSerial.open(9600);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  mSerial = createSerial();
   
  let mConnectButton = createButton("Connect to Serial");
  mConnectButton.position(width/2, height/2);
  mConnectButton.mousePressed(connect);
}

function draw() {
  background(0);
  if (mSerial.opened()&& mSerial.availableBytes() > 0){
    let mLine = mSerial.readUntil("\n");
    print(mline);
  }

}
