let mSerial;
let seaWave = [];
let dropNum = 9000;
const ParticleArray = Array(dropNum);
let alpha;
let currentSerialVal1 = 0;
let currentSerialVal2 = 0;
let currentSerialVal3 = 0;
let currentSerialVal4 = 0;
let currentStage = 1;
let butterflyarray = [];
let mCamera;

let mySound;
let audioControlRect = { x: 30, y: 30, width: 170, height: 80, color: 'green' };
let audioPlaying = false;

function preload() {
  gif_createImg = createImg("giphy.gif");
  // soundFormats('mp3', 'ogg');
  mySound = loadSound('taiyi.mp3');
}

function audioPressed() {
  // Play or pause the sound when the rectangle is clicked
  if (!audioPlaying) {
    mySound.loop(); // Use loop instead of play for continuous playing
    audioPlaying = true;
    audioControlRect.color = 'red';  // Change color to indicate the audio is playing
  } else {
    mySound.pause();
    audioPlaying = false;
    audioControlRect.color = 'green';  // Change color back to indicate the audio is paused
  }
}

function connect() {
  console.log("Attempting to open Serial Connection...");
  mSerial.open(9600); // Replace with your actual serial port
}

function setup() {
  mySound.setVolume(0.5);

  let canvasWidth = windowWidth - 300;
  let canvasHeight = windowHeight / 2;
  let cnv = createCanvas(canvasWidth, canvasHeight);
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  cnv.position(x, y);
  background(0);

  pixelDensity(1);
  mSerial = createSerial();
  
  let mConnectButton = createButton("Connect to Serial");
  mConnectButton.position(windowWidth - 300, windowHeight / 10 * 9);
  mConnectButton.mousePressed(connect);

  setParticles(); // Initialize particles
}

function parseSerialData(data) {
  let vals = data.split(",");
  if (vals.length >= 4) {
    currentSerialVal1 = parseInt(vals[0]);
    currentSerialVal2 = parseInt(vals[1]);
    currentSerialVal3 = parseInt(vals[2]);
    currentSerialVal4 = parseInt(vals[3]);
    console.log("Parsed values:", currentSerialVal1, currentSerialVal2, currentSerialVal3, currentSerialVal4);
    handleStageTransition();
  }
}

function handleStageTransition() {
  if (currentSerialVal2 === 1) {
    console.log("Switching to stage 2");
    currentStage = 2;
  } else if (currentSerialVal3 === 1) {
    console.log("Switching to butterfly stage");
    createButterfly();
  } else if (currentSerialVal4 === 1) {
    console.log("Switching to stage 4");
    currentStage = 4;
  }
}

function createButterfly() {
  let butinfo = {
    x: random(width),
    y: random(height),
    size: random(20, 50),
    alpha: 255, // Initial alpha value
    g: loadImage("giphy.gif"),
  };
  butterflyarray.push(butinfo);
}

function mousePressed() {
  // Check if the mouse is inside the rectangle
  if (mouseX > audioControlRect.x && mouseX < audioControlRect.x + audioControlRect.width &&
      mouseY > audioControlRect.y && mouseY < audioControlRect.y + audioControlRect.height) {
    audioPressed();
  }
}

function audioPressed() {
  // Play or pause the sound when the rectangle is clicked
  if (!audioPlaying) {
    mySound.loop(); // Use loop instead of play for continuous playing
    audioPlaying = true;
  } else {
    mySound.pause();
    audioPlaying = false;
  }
}

function draw() {
  switch (currentStage) {
    case 1:
      stage1();
      break;
    case 2:
      stage2();
      break;
    case 4:
      stage4();
      break;
    // Add other cases as needed
  }

  if (frameCount % 60 === 0) {
    mSerial.write('\n');
  }

  if (mSerial.available() > 0) {
    serialEvent();
  }
}
function serialEvent() {
  let inString = mSerial.read();
  if (inString) {
    console.log("Received data:", inString);
    parseSerialData(inString);
  }
}



function stage1() {
  background("blue");
  fill("pink");
  textAlign(CENTER, CENTER);
  text("庄周梦蝶", width / 2, height / 2 - 20);
  text("Welcome! Press Button1 to start.", width / 2, height / 2);
  textAlign(CENTER, CENTER);
  fill("red")
  text("Play Audio", audioControlRect.x + audioControlRect.width / 2, audioControlRect.y + audioControlRect.height / 2);


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
  for (let i = 0; i < butterflyarray.length; i++) {
    let butterfly = butterflyarray[i];

    // Decrease the alpha value
    butterfly.alpha -= 1; // You can adjust the rate of alpha reduction

    // Remove butterflies with alpha <= 0
    if (butterfly.alpha <= 0) {
      butterflyarray.splice(i, 1);
      i--;
    }

    // Set the alpha when displaying the image
    tint(255, butterfly.alpha);
    image(butterfly.g, butterfly.x, butterfly.y, 100, 100);
  }


}

function stage3() {
  // butterfly flew from the lower right corner
  background(0);
  let dropNum = 300;
  let pixelSlider;

}

let pixelSize = 12; // Initial pixelation factor
let accumulatedPixelSize = 0; 

function stage4() {
  if (!mCamera) {
    mCamera = createCapture(VIDEO);
    mCamera.hide(); // Hide the HTML element, but still draw it in the canvas
  }
  background(255, 204, 0);

  // Accumulate pixelation effect if currentSerialVal4 is 1
  if (currentSerialVal4 === 1) {
    accumulatedPixelSize += 4; // Adjust the increment value as needed
  } 


  // Ensure the accumulated pixel size stays within a desired range
  accumulatedPixelSize = constrain(accumulatedPixelSize, 0, 30);

  // Calculate the number of pixels in both dimensions
  let cols = width / (pixelSize + accumulatedPixelSize);
  let rows = height / (pixelSize + accumulatedPixelSize);

  // Loop through the camera feed and pixelate
  mCamera.loadPixels();
  loadPixels();

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      // Calculate the pixel coordinates
      let x = i * (pixelSize + accumulatedPixelSize);
      let y = j * (pixelSize + accumulatedPixelSize);

      // Calculate the pixel index in the camera feed
      let cameraX = int(map(i, 0, cols, 0, mCamera.width));
      let cameraY = int(map(j, 0, rows, 0, mCamera.height));

      // Get the color from the camera feed
      let col = mCamera.get(cameraX, cameraY);

      // Set the pixel color in the canvas
      for (let dx = 0; dx < (pixelSize + accumulatedPixelSize); dx++) {
        for (let dy = 0; dy < (pixelSize + accumulatedPixelSize); dy++) {
          let px = x + dx;
          let py = y + dy;
          set(px, py, col);
        }
      }
    }
  }

  // Update the canvas with the pixelated camera feed
  updatePixels();
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