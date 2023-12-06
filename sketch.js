let mSerial;
let readyToRead;

let circles = [];
let rectangles = [];

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

  noStroke();
}

function draw() {
  background(0);

  if (mSerial.opened() && readyToRead) {
    mSerial.clear();
    mSerial.write(10);
    readyToRead = false;
  }

  if (mSerial.opened() && mSerial.availableBytes() > 0) {
    let mLine = mSerial.readUntil("\n");
    print(mLine);

    
    let shapeSize = constrain(parseInt(mLine), 10, 100);
    let rectPos = constrain(parseInt(mLine), 10, 250);


    rectangles.push({
      pos: createVector(random(width - shapeSize), random(height - shapeSize)),
      size: shapeSize,
      color: color(random(255), random(255), random(255), 150),
    });


    circles.push({
      pos: createVector(random(width - shapeSize), random(height - shapeSize)),
      size: shapeSize,
      color: color(random(255), random(255), random(255), 150),
    });

    readyToRead = true;
  }

  for (let i = 0; i < rectangles.length; i++) {
    fill(rectangles[i].color);
    rect(rectangles[i].pos.x, rectangles[i].pos.y, rectangles[i].size, rectangles[i].size);
  }

  for (let i = 0; i < circles.length; i++) {
    fill(circles[i].color);
    ellipse(circles[i].pos.x, circles[i].pos.y, circles[i].size, circles[i].size);

  }

// I used splice to control the total shape ns
  if (rectangles.length > 50) {
    rectangles.splice(0, 1);
  }
  if (circles.length > 50) {
    circles.splice(0, 1);
  }
}
