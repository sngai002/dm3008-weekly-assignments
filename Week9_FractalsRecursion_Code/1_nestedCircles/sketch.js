/* DN3008 Generative Art, Ashley Hi 2026
 * Week 9 - Fractals & Recursion
 * 01: NESTED WORLDS – starter code
 * Recursive Function: A circle that draws smaller copies of itself.
 * Work through the steps in order.
 
 * STEP 1   Run the sketch. drawRings() draws one circle. Read it carefully.
 
 * STEP 2   Make it recursive. At the bottom of drawRings(), call drawRings()
            again with the same centre, a radius of r * 0.75 and depth - 1.
            Add a BASE CASE at the top of the function body:
            if (depth === 0) return;
            Try removing the base case for a second to see why it matters
            (save first! the tab may freeze).
            
 * STEP 3   Branch. Replace the single call with TWO calls: one child to the
            left, one to the right. Each child has radius r * 0.5 and sits
            against the inside edge of its parent:
                const childR = r * 0.5;
                const offset = r - childR;
                drawRings(x - offset, y, childR, depth - 1);
                drawRings(x + offset, y, childR, depth - 1);
            Now try FOUR children: left, right, up, down. Use a for loop and
            cos()/sin() with angles i * HALF_PI.
          
* STEP 4    Colour by depth. Pass the starting depth in as a parameter (call it
            `top`) so you can work out level = top - depth. Use map() on level
            to set hue, alpha and strokeWeight. Thick and bright outside,
            thin and faint inside usually looks best. Try blendMode(ADD) in
            draw() for a glow.
            
* STEP 5    Bring it to life.
              a)  Replace 0.5 with a `ratio` parameter driven by
                 map(sin(frameCount * 0.01), -1, 1, 0.42, 0.55).
              b) Add an angle offset that grows with frameCount so each level rotates; make deeper levels turn faster.
              c) Map mouseY to the depth (between 2 and 6). Watch the frame rate: four children at depth 6 is already 5,461 circles per frame.
*/
let mouseTouched = false;

function mouseMoved() {
  mouseTouched = true;
}


function setup() {
  createCanvas(800, 800);
  colorMode(HSB, 360, 100, 100, 100);
  noFill();
}

function draw() {
  background(235, 70, 7);

  let ratio = map(sin(frameCount * 0.01), -1, 1, 0.42, 0.55);
  if (mouseIsPressed) ratio = map(mouseX, 0, width, 0.3, 0.62, true);
  const depth = mouseTouched ? floor(map(mouseY, 0, height, 2, 6, true)) : 5;

  drawRings(width / 2, height / 2, 340, 5, depth, ratio, 0);
}

// x, y = centre of circle
// r radius of` circle
// depth = how many more levels to draw (countdown to 0)
// top = the starting depth (used to calculate level)
// ratio = how much smaller each child is than its parent
// spin = how much to rotate each level
function drawRings(x, y, r, depth, top, ratio, spin) {
  const level = top - depth;
  const hue = (map(level, 0, top, 200, 340) + frameCount * 0.2) % 360;
  stroke(hue, 65, 95, map (level, 0, top, 70, 35));
  strokeWeight(2);
  circle(x, y, r * 2);

  // STEP 2: base case + recursive call go here
if (depth === 0 || r < 2) return;

const childR = r * ratio;
const offset = r - childR;
const turn = spin + frameCount * 0.0015;
for (let i = 0; i < 4; i++) {
  const a = turn + i * HALF_PI;
  drawRings(x + offset * cos(a), y + offset * sin(a), childR, depth - 1, top, ratio, turn);
}
}
function keyPressed() {
  if (key === "s" || key === "S") saveCanvas("nested-worlds", "png");
}
