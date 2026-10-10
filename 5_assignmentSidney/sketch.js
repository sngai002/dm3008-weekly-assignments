/*

Week 5 - Sidney

*/

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(15);
  noFill();
  strokeWeight(1);
}

function draw() {
  blendMode(BLEND); // reset first, or background() multiplies over the last frame
  background(245, 242, 233);

  // fit the 512 x 512 print into the middle of the window
  var printSize = min(width, height);
  var printX = (width - printSize) / 2;
  var printY = (height - printSize) / 2;
  var s = printSize / 512;

  blendMode(MULTIPLY);

  push();
  translate(printX, printY);
  scale(s);
  strokeWeight(1.4 / s); // dot size - raise this for heavier ink coverage

  //=== blue - atmospheric column ===
  // gaussian across x, even down y
  push();
  translate(random(-2, 2), random(-2, 2));
  stroke(0, 120, 191, 55);
  for (var i = 0; i < 3500; i++) {
    var hazeX = randomGaussian(180, 92);
    var hazeY = random(-20, 532);
    point(hazeX, hazeY);
  }
  pop();

  //=== blue - rotated block ===
  // density pulled into the bottom-left corner
  push();
  translate(126 + random(-2, 2), 368 + random(-2, 2));
  rotate(-PI / 14);
  stroke(0, 120, 191, 110);
  for (var i = 0; i < 4500; i++) {
    var blockX = getMinBiasRand(-112, 112, 2);
    var blockY = getMaxBiasRand(-96, 96, 2);
    point(blockX, blockY);
  }
  pop();

  //=== yellow - corner wash ===
  // goes orange where the pink circle prints over it
  push();
  translate(random(-2, 2), random(-2, 2));
  stroke(255, 218, 0, 80);
  for (var i = 0; i < 3000; i++) {
    var washX = getMaxBiasRand(140, 532, 3);
    var washY = getMinBiasRand(-20, 300, 3);
    point(washX, washY);
  }

  //=== yellow - wave ===
  stroke(255, 218, 0, 135);
  translate(0, 302);
  var amp = 26;
  for (var i = 0; i < 5000; i++) {
    var waveX = random(0, 512);
    var waveY = cos((waveX / 512) * PI * 6) * amp;
    waveY += randomGaussian(0, 11);
    point(waveX, waveY);
  }
  pop();

  //=== pink - fuzzy circle ===
  // a gaussian added to the radius softens the edge
  push();
  translate(322 + random(-2, 2), 172 + random(-2, 2));
  stroke(255, 72, 176, 80);
  for (var i = 0; i < 6000; i++) {
    var cirDist = sqrt(random(0, 1)) * 102 + randomGaussian(0, 11);
    var cirAngle = random(0, PI * 2);
    var c = createVector(cos(cirAngle), sin(cirAngle));
    c.mult(cirDist);
    point(c.x, c.y);
  }

  //=== pink - halo ===
  // same circle, but the radius itself is a gaussian band
  stroke(255, 72, 176, 150);
  for (var i = 0; i < 2500; i++) {
    var ringDist = 147 + randomGaussian(0, 3.2);
    var ringAngle = random(0, PI * 2);
    var r = createVector(cos(ringAngle), sin(ringAngle));
    r.mult(ringDist);
    point(r.x, r.y);
  }
  pop();

  //=== pink - dust ===
  push();
  translate(random(-2, 2), random(-2, 2));
  stroke(255, 72, 176, 45);
  for (var i = 0; i < 2000; i++) {
    var dustX = getMaxBiasRand(150, 512, 3);
    var dustY = getMaxBiasRand(210, 512, 2);
    point(dustX, dustY);
  }
  pop();

  //=== green - small circle ===
  // max() bias crowds the points towards the rim
  push();
  translate(104 + random(-2, 2), 126 + random(-2, 2));
  stroke(0, 169, 92, 110);
  for (var i = 0; i < 2000; i++) {
    var grDist = max(random(0, 1), random(0, 1)) * 38 + randomGaussian(0, 7);
    var grAngle = random(0, PI * 2);
    var g = createVector(cos(grAngle), sin(grAngle));
    g.mult(grDist);
    point(g.x, g.y);
  }

  //=== green - halo ===
  stroke(0, 169, 92, 130);
  for (var i = 0; i < 900; i++) {
    var grRingDist = 61 + randomGaussian(0, 2);
    var grRingAngle = random(0, PI * 2);
    var gr = createVector(cos(grRingAngle), sin(grRingAngle));
    gr.mult(grRingDist);
    point(gr.x, gr.y);
  }
  pop();

  //=== black - rules ===
  // a solid random core with gaussian spill either side for soft edges
  push();
  translate(random(-2, 2), random(-2, 2));
  stroke(33, 30, 31, 150);
  for (var i = 0; i < 1000; i++) {
    var topX = random(44, 468);
    var topY = 84 + random(-1.2, 1.2) + randomGaussian(0, 1.3);
    point(topX, topY);
  }
  for (var i = 0; i < 1600; i++) {
    var botX = random(44, 468);
    var botY = 424 + random(-3.2, 3.2) + randomGaussian(0, 1.8);
    point(botX, botY);
  }

  //=== black - tick ===
  stroke(33, 30, 31, 110);
  for (var i = 0; i < 1000; i++) {
    var tickX = randomGaussian(428, 4.5);
    var tickY = random(118, 286);
    point(tickX, tickY);
  }
  pop();

  //=== black - off-register ghost of the wave ===
  push();
  translate(random(-2, 2), 308 + random(-2, 2));
  stroke(33, 30, 31, 70);
  for (var i = 0; i < 1800; i++) {
    var ghostX = random(0, 512);
    var ghostY = cos((ghostX / 512) * PI * 6) * 26;
    ghostY += randomGaussian(0, 13);
    point(ghostX, ghostY);
  }
  pop();

  pop();

  //=== unprinted paper margin ===
  // masks the ink back to a clean square with a 26 unit border
  var m = 26 * s;
  blendMode(BLEND);
  noStroke();
  fill(245, 242, 233);
  rect(0, 0, width, printY + m);
  rect(0, printY + printSize - m, width, height);
  rect(0, 0, printX + m, height);
  rect(printX + printSize - m, 0, width, height);
  noFill();

  //=== paper tooth ===
  blendMode(MULTIPLY);
  stroke(33, 30, 31, 9);
  for (var i = 0; i < 1500; i++) {
    point(random(0, width), random(0, height));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function getMinBiasRand(_min, _max, iters) {
  var r = _max;
  for (var i = 0; i < iters; i++) {
    r = min(r, random(_min, _max));
  }
  return r;
}

function getMaxBiasRand(_min, _max, iters) {
  var r = _min;
  for (var i = 0; i < iters; i++) {
    r = max(r, random(_min, _max));
  }
  return r;
}