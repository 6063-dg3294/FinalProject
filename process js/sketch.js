var gif_createImg;

let mSerial;
let mCamera;
let seaWave = [];
let dropNum = 6000;
const ParticleArray = Array(dropNum);
let alpha;
let currentSerialVal1 = 0;
let currentSerialVal2 = 0;
let  currentSerialVal3 = 0;
let currentStage = 1;

let butterflyarray = [];

function preload() {
  gif_createImg = createImg("giphy.gif");
}




function connect() {
  console.log("Attempting to open Serial Connection...");
  mSerial.open(9600); // Replace with your actual serial port
}

function setup() {
  let canvasWidth = windowWidth - 300;
  let canvasHeight = windowHeight/2;
  let cnv = createCanvas(canvasWidth, canvasHeight);
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  cnv.position(x, y);
  background(0);

  pixelDensity(1);
  // mCamera = createCapture(VIDEO);
  // mCamera.hide();

  mSerial = createSerial();
  

  let mConnectButton = createButton("Connect to Serial");
  mConnectButton.position(windowWidth - 300, windowHeight / 10 * 9);
  mConnectButton.mousePressed(connect);

  setParticles(); // Initialize particles
}


function parseSerialData(data) {
  let vals = data.split(",");
  if (vals.length >= 3) {
    currentSerialVal1 = parseInt(vals[0]);
    currentSerialVal2 = parseInt(vals[1]);
    currentSerialVal3 = parseInt(vals[2]);
    console.log("Parsed values:", currentSerialVal1, currentSerialVal2, currentSerialVal3);
    
    // Handle button press for stage switching or other actions
    if (currentSerialVal2 === 1) {
      console.log("Button 1 pressed, switching to stage 2");
      currentStage = 2;
    } else if (currentSerialVal3 === 1) {
        console.log("Switching to stage butterfly");
        // drawgif();
      let butinfo = {
        x: random(windowWidth),
        y: random(windowHeight),
        size: random(20, 50),
        g: loadImage("giphy.gif"),
        createdTime: millis()
      }

      butterflyarray.push(butinfo);

    }
  }
}

function drawgif(){
  blendMode(BLEND);
  // gif_createImg.position(width - 200, 350);
}

function draw() {
  if (currentStage === 1) {
    stage1();
  } else if (currentStage === 2) {
    stage2();
  // } else if (currentStage === 3) {
  //   stage3();
  }

  // Request and read data from serial
  if (frameCount % 60 === 0) { // Send request every second
    mSerial.write('\n'); // Request data from Arduino
  }

  if (mSerial.available() > 0) {
    serialEvent(); // Handle incoming serial data
  }
}

let serialBuffer = '';

function serialEvent() {
  while (mSerial.available()) {
    // Read a char from the serial and add it to the buffer
    let inChar = mSerial.read();
    if (inChar === '\n') {
      let dataString = serialBuffer.trim(); // Remove whitespace
      if (dataString.length > 0) {
        parseSerialData(dataString);
      }
      serialBuffer = ''; // Clear the buffer
    } else {
      serialBuffer += inChar; // Accumulate the char into the buffer
    }
  }
}

function stage1() {
  background("blue");
  fill("pink");
  textAlign(CENTER, CENTER);
  text("Welcome! Click to start.", width / 2, height / 2);
}

function stage2() {
  noStroke();
  smooth();
  alpha = 55;

  // image(mCamera, 0, 0, width / 5, height);

  fill("blue");
  // ellipse(width / 2, height / 2, 300, 300);
  rect(0, height/4*3, width, height/70);
  rect(0, height/4*3 - 30, width, height/70);

  blendMode(BLEND);
  alpha = map(frameCount % 60, 0, width, 0, 55);
  fill(currentSerialVal1, 20, 120, alpha);
  rect(0, 0, width, height);

  loadPixels();
  
  ParticleArray.forEach(p => p.move());

  for (let i = 0; i < seaWave.length; i++) {
    seaWave[i].x += seaWave[i].speed;
    seaWave[i].y = height / 2 + sin(noise(seaWave[i].noiseOffsetX) * 2 * PI) * seaWave[i].amplitude + sin(noise(seaWave[i].noiseOffsetY) * 2 * PI) * seaWave[i].amplitude;
    seaWave[i].noiseOffsetX += 0.01 * seaWave[i].speed;
    seaWave[i].noiseOffsetY += 0.01 * seaWave[i].speed;

    fill(map(currentSerialVal1, 0, 255, 20, 250), map(currentSerialVal1, 0, 255, 0, 100), map(currentSerialVal1, 0, 255, 0, 200), alpha);
    ellipse(seaWave[i].x, seaWave[i].y, 10, 10);
  }

  seaWave = seaWave.filter((wave) => wave.x < width);

  if (seaWave.length > 50) {
    seaWave.splice(0, 1);
  }

  updatePixels();

  let currentTime = millis();
  for (let i = 0; i < butterflyarray.length; i++){
    let butterfly = butterflyarray[i];
    // butterfly.g.position(butterfly.x, butterfly.y);
    if (currentTime - butterfly.createdTime < 10000){
      image(butterfly.g, butterfly.x, butterfly.y, 50, 50);
    }
  } 

  butterflyarray = butterflyarray.filter(butterfly => currentTime - butterfly.createdTime < 5000);
}

function stage3() {
  // butterfly flew from the lower right corner
  background(0);
  let dropNum = 300;

}





function setParticles() {
  for (let i = 0; i < dropNum; i++) {
    ParticleArray[i] = new Particle();
  }
}

class Particle {
  constructor() {
    this.posX = random(width);
    this.posY = random(height);
    this.incr = 0;
    this.theta = 0;
    this.c = color(20, int(map(this.posY, 0, height, 205, 0)), 255);
    this.n = noise(0.01 * width);
  }

  update() {
    this.incr += 0.01;
    this.theta = noise(this.posX * 0.002, this.posY * 0.004, this.incr) * TWO_PI;
    this.posX += 2 * cos(this.theta) * map(currentSerialVal1, 0, 255, 0.1, 2);
    this.posY += 2 * sin(this.theta) * map(currentSerialVal1, 0, 255, 0.1, 2);
  }

  display() {
    if (this.posX > 0 && this.posX < width && this.posY > 0 && this.posY < height) {
      set(int(this.posX), int(this.posY), color(red(this.c), green(this.c), blue(this.c), alpha / 2));
      set(int(this.posX + this.n), int(this.posY + random(12)), color(255, 255, 255, random(1)));
    }
  }

  wrap() {
    if (this.posX < 0) this.posX = width;
    if (this.posX > width) this.posX = 0;
    if (this.posY < 0) this.posY = height;
    if (this.posY > height) this.posY = 0;
  }

  move() {
    this.update();
    this.wrap();
    this.display();
  }
}
