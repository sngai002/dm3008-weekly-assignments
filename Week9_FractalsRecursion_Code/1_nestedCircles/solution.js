// 01 · NESTED WORLDS — reference solution
// A circle that contains smaller copies of itself, which contain smaller copies...
// Move the mouse left/right to change how much each child shrinks.
// Move up/down to change how many levels deep the recursion goes.
// Press S to save a PNG.

const MAX_DEPTH = 6;
let mouseTouched = false;
function mouseMoved() { mouseTouched = true; }

function setup() {
  createCanvas(800, 800);
  colorMode(HSB, 360, 200, 100, 100);
  noFill();
}

function draw() {
  background(235, 70, 7);

  // Step 5: the ratio breathes slowly, but the mouse can take over
  let ratio = map(sin(frameCount * 0.001), -1, 1, 0.42, 0.55);
  if (mouseIsPressed) ratio = map(mouseX, 0, width, 0.3, 0.62, true);
  // until the mouse moves, show a rich default depth
  const depth = mouseTouched ? floor(map(mouseY, 0, height, 2, MAX_DEPTH + 1, true)) : 5;

  // ADD blending makes overlapping strokes glow
  blendMode(ADD);
  drawRings(width / 2, height / 2, 340, depth, depth, ratio, 0);
  blendMode(BLEND);
}

// x, y   centre of this circle
// r      radius of this circle
// depth  how many more levels to draw (counts down to 0)
// top    the starting depth, so colour can be mapped consistently
// ratio  child radius as a fraction of the parent radius
// spin   accumulated rotation, so each level turns a little more
function drawRings(x, y, r, depth, top, ratio, spin) {
  // Step 4: colour, weight and transparency all depend on depth
  const level = top - depth;                       // 0 at the outside
  const hue = (map(level, 0, top, 200, 340) + frameCount * 0.2) % 360;
  stroke(hue, 65, 95, map(level, 0, top, 70, 35));
  strokeWeight(map(level, 0, top, 3, 0.6));
  circle(x, y, r * 2);

  // Step 2: base case — stop when we run out of depth or the circle is tiny
  if (depth === 0 || r < 2) return;

  // Step 3: four children, each sitting against the inside edge of the parent
  const childR = r * ratio;
  const offset = r - childR;
  const turn = spin + frameCount * 0.0015 * (level + 1);
  for (let i = 0; i < 4; i++) {
    const a = turn + i * HALF_PI;
    drawRings(x + cos(a) * offset, y + sin(a) * offset, childR, depth - 1, top, ratio, turn);
  }
}

function keyPressed() {
  if (key === 's' || key === 'S') saveCanvas('nested-worlds', 'png');
}
