let mSerial;
let readyToRead;
let cColor = 0;

function connect(){
  mSerial.open(9600);
  readyToRead = true;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  mSerial = createSerial();

  readyToRead = false;

   
  let mConnectButton = createButton("Connect to Serial");
  mConnectButton.position(width/2, height/2);
  mConnectButton.mousePressed(connect);
}

function draw() {
  background(0);

  if (readyToRead){
    mSerial.clear();
    mSerial.write(10);
    readyToRead = false;
  }

  if (mSerial.opened() && mSerial.availableBytes() > 0){
    let mLine = mSerial.readUntil("\n");

    // print(mLine);
    cColor = constrain(parseInt(mLine), 0, 255);
    readyToRead = true;
  }

}
