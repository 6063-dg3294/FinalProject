let mSerial;
let readyToRead;

let seaWave = [];
let dropNum = 6000;
const ParticleArray = Array(dropNum);
let alpha;

function connect() {
  mSerial.open(9600);
  readyToRead = true;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  mSerial = createSerial();
  readyToRead = false;

  let mConnectButton = createButton("Connect to Serial");
  mConnectButton.position(width / 2, height / 2);
  mConnectButton.mousePressed(connect);

  // draw

  noStroke();
  smooth();
  alpha = 55;
  setParticles();
}

function draw() {
  frameRate(60);
  // https://p5js.org/reference/#/p5/blendMode
  blendMode(BURN);
  alpha = map(frameCount % 60, 0, width, 0, 55);
  fill(0, alpha);
  rect(0, 0, width, height);

  loadPixels();

  for (let p of ParticleArray) {
    p.move();
  }

  for (let i = 0; i < seaWave.length; i++) {
    seaWave[i].x += seaWave[i].speed;
    seaWave[i].y =
      height / 2 +
      sin(noise(seaWave[i].noiseOffsetX) * 2 * PI) * seaWave[i].amplitude +
      sin(noise(seaWave[i].noiseOffsetY) * 2 * PI) * seaWave[i].amplitude;

    seaWave[i].noiseOffsetX += 0.01 * seaWave[i].speed;
    seaWave[i].noiseOffsetY += 0.01 * seaWave[i].speed;

    fill(
      map(mSerial.read(), 0, 255, 0, 360),
      map(mSerial.read(), 0, 255, 150, 255),
      255,
      alpha
    );
    ellipse(seaWave[i].x, seaWave[i].y, 10, 10);
  }

  seaWave = seaWave.filter((wave) => wave.x < width);

  if (seaWave.length > 50) {
    seaWave.splice(0, 1);
  }

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
    this.posX += 2 * cos(this.theta) * map(mSerial.read(), 0, 255, 0.1, 2);
    this.posY += 2 * sin(this.theta) * map(mSerial.read(), 0, 255, 0.1, 2);
  }

  display() {
    if (
      this.posX > 0 &&
      this.posX < width &&
      this.posY > 0 &&
      this.posY < height
    ) {
      set(
        int(this.posX),
        int(this.posY),
        color(
          red(this.c),
          green(this.c),
          blue(this.c),
          alpha / 2
        )
      );
      set(
        int(this.posX + this.n),
        int(this.posY + random(12)),
        color(255, 255, 255, random(1))
      );
    }
  }

  wrap() {
    if (this.posX < 0) {
      this.posX = width;
    }
    if (this.posX > width) {
      this.posX = 0;
    }
    if (this.posY < 0) {
      this.posY = height;
    }
    if (this.posY > height) {
      this.posY = 0;
    }
  }

  move() {
    this.update();
    this.wrap();
    this.display();
  }
}

// function keyPressed() {
//   save(
//     "img_" +
//       month() +
//       "-" +
//       day() +
//       "_" +
//       hour() +
//       "-" +
//       minute() +
//       "-" +
//       second() +
//       ".jpg"
//   );
// }
