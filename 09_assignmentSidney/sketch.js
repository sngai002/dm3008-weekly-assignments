/* DN3008 Generative Art, Ashley Hi 2026
 * Week 9 - Fractals & Recursion 
 * 02: LIVING TREE — starter
 * A tree is a branch with two smaller trees on top of it.
 * The sky is done for you; you build the tree.
 *
 * STEP 1  Run it. You should see a trunk. Notice translate() moves the origin to the bottom-centre, and the trunk is drawn UP (negative y).

 * STEP 2  Inside branch(), after line(), move the origin to the END of the branch with translate(0, -len). Then call branch(len * 0.7, depth - 1). You get one long wobbly line. Why? (There's no rotation yet.)
 
 * STEP 3  Two branches. Replace your single call with:
             push(); rotate(angle);  branch(len * 0.7, depth - 1, angle); pop();
             push(); rotate(-angle); branch(len * 0.7, depth - 1, angle); pop();
         push()/pop() are what make this work: each child starts from the
         parent's tip, not from wherever the previous child finished.

 * STEP 4  Base case. At the top of branch(), after drawing the line, add
             if (depth === 0) return;
         Change DEPTH between 4 and 11. How many lines is depth 11? (2^12 - 1)

 * STEP 5  Map mouseX to the angle in draw(), between 0.15 and 0.75 radians.

 * STEP 6  Thickness and colour by depth.
         strokeWeight(map(depth, 0, DEPTH, 0.6, 16));
         Let t = 1 - depth / DEPTH (0 at the trunk, 1 at the tips) and use
         lerpColor(bark, twig, t) for the stroke. Add strokeCap(ROUND).

 * STEP 7  Make it organic. Add random(-0.15, 0.15) to each angle, and use
         random(0.66, 0.78) instead of 0.7. It flickers! Fix it with
         randomSeed(seed) at the top of draw(). Press R to pick a new seed
         (already wired up in keyPressed()).

 * STEP 8  Wind. Add this to both angles:
             const wind = (noise(depth * 0.3, frameCount * 0.008) - 0.5) * 0.5 * t;
         Because it is multiplied by t, the tips sway and the trunk doesn't.

 * STEP 9  Blossoms. In the base case, before return, call blossom(): a soft
         pink circle with noStroke() and some transparency.
*/
const DEPTH = 9;
let seed = 7;
let sky;

function setup() {
  createCanvas(800, 800);
  colorMode(HSB, 360, 100, 100, 100);
  sky = createGraphics(width, height);
  paintSky(sky);
}

function draw() {
  image(sky, 0, 0);
  randomSeed(seed); // STEP 7: add this to make the tree flicker less 

  const angle = map(mouseX, 0, width, 0.15, 0.75); // STEP 5: replace with map(mouseX, ...)

  push();
  translate(width / 2, height - 90);
  branch(165, DEPTH, angle);
  pop();

  noStroke();
  fill(250, 45, 12);
  ellipse(width / 2, height + 40, width * 1.6, 300);
}

function branch(len, depth, angle) {
  const t = 1 - depth / DEPTH;
  const bark = color(20, 45, 40);
  const twig = color(330, 35, 70);
  stroke(lerpColor(bark, twig, pow(t, 1.6)));
  strokeWeight(map(depth, 0, DEPTH, 0.6, 16));
  strokeCap(ROUND);
  line(0, 0, 0, -len);
  translate(0, -len);

if (depth === 0) {
  blossom();
  return;
}
  

  const wind = (noise(depth * 0.3, frameCount * 0.008) - 0.5) * 0.5 * t; // STEP 8: add this line
  const a1 = angle + random(-0.15, 0.15) + wind; // STEP 7: add random() and wind
  const a2 = -angle + random(-0.15, 0.15) + wind; // STEP 7: add random() and wind

  push();
  rotate(a1);
  branch(len * random(0.66, 0.78), depth - 1, angle);
  pop();

  push();
  rotate(a2);
  branch(len * random(0.66, 0.78), depth - 1, angle);
  pop();


  // STEPS 2–4 and 7–9 go here
}

function blossom() {
  if (random() > 0.85) return;          // leave some tips bare
  noStroke();
  const r = random(5, 12);
  fill(335, 25, 100, 0.2);               // soft halo
  circle(0, 0, r * 3.4);
  fill(random(325, 350), random(25, 45), random(90, 100), random(50, 80));
  circle(random(-2, 2), random(-2, 2), r);
}

// --- given: the dusk sky (you don't need to change this) ---
function paintSky(g) {
  g.colorMode(HSB, 360, 100, 100, 100);
  g.noStroke();
  for (let y = 0; y < g.height; y++) {
    const t = y / g.height;
    g.fill(lerpColor(color(250, 60, 14), color(15, 55, 75), pow(t, 1.8)));
    g.rect(0, y, g.width, 1);
  }
  randomSeed(3);
  for (let i = 0; i < 140; i++) {
    g.fill(0, 0, 100, random(20, 80));
    g.circle(random(g.width), random(g.height * 0.55), random(0.8, 2.2));
  }
  g.fill(40, 20, 100, 90);
  g.circle(g.width * 0.78, g.height * 0.24, 70);
}

function keyPressed() {
  if (key === "r" || key === "R") seed = floor(random(100000));
  if (key === "s" || key === "S") saveCanvas("living-tree", "png");
}
