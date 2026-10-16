/*

Week 4 - Sidney
Built from Wave Composition A: the breathing ring, but in rainbow, with trails,
and with the "@" springy toy from week 3 riding along it.

Press "s" to toggle slow motion (frameRate 6) and watch how each frame is built.

*/

var frequency = 7; // how many bumps go round the ring - keep it a whole number so the ring joins up
var rad = 170; // base radius of the ring
var amp = 55; // how far the bumps push in and out
var glyphStep = 20; // an "@" every this many degrees
var spin = 0; // keeps adding up every frame, like i in week 3

var slowMode = false;

function setup() {
  createCanvas(800, 800);
  colorMode(HSB, 360, 100, 100, 100);
  textAlign(CENTER, CENTER);
  textSize(22);
  background(0);
}

function draw() {
  // translucent background instead of a solid one, so old frames fade into trails
  // lower alpha = longer trails
  noStroke();
  fill(0, 0, 0, 12);
  rect(0, 0, width, height);

  // the fade alone never quite reaches black and leaves grey ghosts behind,
  // so take a tiny bit off everything as well
  // (SUBTRACT only works in WEBGL - DIFFERENCE with a near-black grey does the same job here)
  blendMode(DIFFERENCE);
  fill(0, 0, 1);
  rect(0, 0, width, height);
  blendMode(BLEND);

  // the whole ring swells and shrinks
  var breathe = 1 + sin(frameCount * 0.015) * 0.25;

  push();
  translate(width / 2, height / 2);

  //=== the ring ===
  // drawn as short lines instead of one shape, so every piece can have its own hue
  strokeWeight(1.5);
  noFill();
  var prev = getRingPoint(0, breathe);
  for (var i = 1; i <= 360; i++) {
    var p = getRingPoint(i, breathe);
    stroke((i + frameCount) % 360, 80, 100, 70);
    line(prev.x, prev.y, p.x, p.y);
    prev = p;
  }

  //=== the "@"s ===
  // each one spins on the spot like the week 3 sketch
  noStroke();
  for (var i = 0; i < 360; i += glyphStep) {
    var g = getRingPoint(i, breathe);
    push();
    translate(g.x, g.y);
    rotate(spin + radians(i));
    fill((i + frameCount * 2) % 360, 80, 100);
    text("@", 0, 0);
    pop();
  }
  pop();

  spin += 0.08;
}

//=== one point on the ring ===
// the radius wobbles with sin() (the wave), then x and y go round the circle.
// y runs ahead of x by a phase that grows over time, so the circle squashes into
// a diagonal line and opens back up again.
// (the original used ^ here, which is bitwise XOR in js, not a power - it rounded x
// down to a few fixed columns, which is why composition A looked jumpy)
function getRingPoint(deg, breathe) {
  var a = rad + sin(radians(deg * frequency + frameCount * 3)) * amp;
  a *= breathe;

  var p = createVector(0, 0);
  p.x = cos(radians(deg)) * a;
  p.y = sin(radians(deg + frameCount * 0.4)) * a;
  return p;
}

function keyPressed() {
  if (key === "s") {
    slowMode = !slowMode;
    if (slowMode) {
      frameRate(6);
    } else {
      frameRate(60);
    }
  }
}
