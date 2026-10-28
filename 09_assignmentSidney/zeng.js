/* DN3008 Generative Art, Ashley Hi 2026
 * Week 9 - Fractals & Recursion
 * 02: LIVING FOREST
 *
 * Swap this in by pointing index.html at it:
 *     <script src="living-forest.js"></script>
 *
 * CONTROLS
 *   mouse X   left = midday, middle = sunset, right = midnight.
 *             The same axis widens the branch angle, so the trees open up
 *             as the light goes.
 *   R         reroll the forest (new tree positions, shapes, blossoms)
 *   S         save a png
 *
 * HOW IT WORKS
 *   Same recursion as the single tree: a branch is a line, then two smaller
 *   trees rotated off its tip. Three things are new.
 *
 *   1. A FOREST. setup() generates TREES trees, each with its own seed,
 *      position, trunk length and recursion depth. They are sorted far to
 *      near and drawn in that order, so near trees overlap far ones.
 *      Distance drives everything: far trees are shorter, thinner, shallower
 *      (depth 6 instead of 9) and blended toward the sky colour, which is
 *      what makes them read as distant rather than just small.
 *
 *   2. A LIVE SKY. The sky can't be a cached createGraphics any more, since
 *      it changes every frame. It's redrawn as BANDS horizontal strips, which
 *      is cheap and smooth enough that you can't see the steps.
 *
 *   3. ONE CELESTIAL BODY. There is no separate sun and moon. A single disc
 *      arcs across the sky on a sine path, dipping to the horizon at the
 *      midpoint (sunset), and its size and colour lerp from sun to moon along
 *      the way. Past about 70% it starts carving a crescent out of itself by
 *      overdrawing a circle filled with the sky colour at that height.
 *
 *   The day/night value `u` (0 to 1) is the single source of truth: sky,
 *   ground, bark, blossom, star opacity and the disc all read from it. It also
 *   sets curNight, which makes the blossoms glow once the light goes.
 */

// ---------------------------------------------------------------- settings

const TREES = 7; // how many trees in the forest
const BANDS = 180; // horizontal strips used to draw the sky gradient
const HORIZON = 0.58; // where the distant ground starts, as a fraction of height

let forestSeed = 7;
let trees = [];
let stars = [];

// set per tree, read inside branch() so the recursion doesn't need 6 arguments
let curDepth, curBark, curTwig, curBloom, curHaze, curWeight;
let curNight = 0; // 0 in daylight, 1 at midnight - drives the blossom glow
let hazeCol;

// ------------------------------------------------------------------- setup

function setup() {
  createCanvas(800, 800);
  colorMode(HSB, 360, 100, 100, 100);
  makeStars();
  makeForest();
}

function makeStars() {
  randomSeed(3);
  stars = [];
  for (let i = 0; i < 170; i++) {
    stars.push({
      x: random(width),
      y: random(height * HORIZON),
      r: random(0.7, 2.3),
      a: random(25, 100),
      phase: random(TWO_PI),
    });
  }
}

function makeForest() {
  randomSeed(forestSeed);
  trees = [];

  for (let i = 0; i < TREES; i++) {
    // spread the trees evenly through the depth range, then jitter
    const far = constrain(i / (TREES - 1) + random(-0.08, 0.08), 0, 1);

    trees.push({
      far: far,
      x: random(width * 0.08, width * 0.92),
      baseY: lerp(height * 0.92, height * (HORIZON + 0.03), far),
      len: lerp(118, 26, far), // nearest trunk is 118, down from 165
      depth: round(lerp(9, 6, far)),
      weight: lerp(1, 0.38, far),
      seed: floor(random(100000)),
    });
  }

  // far trees first so near trees paint over them
  trees.sort((a, b) => b.far - a.far);
}

// -------------------------------------------------------------------- draw

function draw() {
  const u = constrain(mouseX / width, 0, 1); // 0 = midday, 1 = midnight
  const angle = map(mouseX, 0, width, 0.18, 0.72);

  const skyTop = triLerp(color(205, 52, 96), color(252, 58, 46), color(250, 70, 11), u);
  const skyBot = triLerp(color(196, 22, 100), color(16, 72, 96), color(238, 55, 24), u);
  hazeCol = lerpColor(skyTop, skyBot, pow(HORIZON, 1.8));
  curNight = constrain(map(u, 0.52, 0.95, 0, 1), 0, 1); // how much the blossoms glow

  paintSky(skyTop, skyBot);
  paintStars(u);
  paintCelestial(u);
  paintGround(u);

  // daylight: 1 at noon, 0 at midnight. Everything the light touches uses it.
  for (const tr of trees) {
    randomSeed(tr.seed); // each tree is stable frame to frame

    curDepth = tr.depth;
    curWeight = tr.weight;
    curHaze = tr.far;
    curBark = triLerp(color(28, 48, 52), color(14, 58, 34), color(234, 34, 16), u);
    curTwig = triLerp(color(38, 42, 88), color(24, 62, 70), color(248, 24, 38), u);
    curBloom = triLerp(color(44, 52, 100), color(30, 78, 100), color(38, 58, 100), u);

    push();
    translate(tr.x, tr.baseY);
    branch(tr.len, tr.depth, angle);
    pop();
  }

  paintForegroundHill(u);
}

// --------------------------------------------------------------- the tree

function branch(len, depth, angle) {
  const t = 1 - depth / curDepth; // 0 at the trunk, 1 at the tips

  let c = lerpColor(curBark, curTwig, pow(t, 1.6));
  if (curHaze > 0) c = lerpColor(c, hazeCol, curHaze * 0.62); // atmospheric perspective

  stroke(c);
  strokeWeight(map(depth, 0, curDepth, 0.4, 13) * curWeight);
  strokeCap(ROUND);
  line(0, 0, 0, -len);
  translate(0, -len); // origin is now the tip, so children start from here

  if (depth === 0) {
    blossom();
    return;
  }

  const wind = (noise(depth * 0.3, frameCount * 0.008) - 0.5) * 0.5 * t;
  const a1 = angle + random(-0.15, 0.15) + wind;
  const a2 = -angle + random(-0.15, 0.15) + wind;

  push();
  rotate(a1);
  branch(len * random(0.66, 0.78), depth - 1, angle);
  pop();

  push();
  rotate(a2);
  branch(len * random(0.66, 0.78), depth - 1, angle);
  pop();
}

function blossom() {
  if (random() > 0.82) return; // leave some tips bare

  noStroke();
  const r = random(4, 11) * curWeight;
  const fade = 1 - curHaze * 0.45; // distant blossoms sit in haze
  const c = lerpColor(curBloom, hazeCol, curHaze * 0.5);

  // Glow. By day this is one faint halo and you barely notice it. At night
  // curNight opens it up into stacked low-alpha discs that spread wider, lose
  // saturation toward white and stack on each other where blossoms overlap,
  // so the dense parts of the canopy light up more than the loose tips.
  const layers = curNight > 0.05 ? (curHaze > 0.5 ? 2 : 3) : 1;
  for (let i = layers; i >= 1; i--) {
    const spread = 2.5 + curNight * 2.8 * (i / layers);
    const a = (11 + curNight * 28) / i;
    fill(hue(c), saturation(c) * (0.72 - curNight * 0.12), brightness(c), a * fade);
    circle(0, 0, r * spread);
  }

  // the blossom itself, brighter and hotter after dark
  fill(
    hue(c) + random(-12, 12),
    saturation(c) * random(0.85, 1.15) * (1 - curNight * 0.1),
    min(100, brightness(c) * random(0.9, 1.05) + curNight * 16),
    min(100, (random(45, 80) + curNight * 20) * fade)
  );
  circle(random(-2, 2) * curWeight, random(-2, 2) * curWeight, r);
}

// ----------------------------------------------------------------- the sky

function paintSky(top, bot) {
  noStroke();
  const h = height / BANDS + 1;
  for (let i = 0; i < BANDS; i++) {
    const ty = i / BANDS;
    fill(lerpColor(top, bot, pow(ty, 1.8)));
    rect(0, ty * height, width, h);
  }
}

function paintStars(u) {
  const night = constrain(map(u, 0.45, 0.88, 0, 1), 0, 1);
  if (night <= 0) return;

  noStroke();
  for (const s of stars) {
    const twinkle = 0.65 + 0.35 * sin(frameCount * 0.03 + s.phase);
    fill(0, 0, 100, s.a * night * twinkle);
    circle(s.x, s.y, s.r);
  }
}

function paintCelestial(u) {
  // one disc, arcing from high-left to high-right and dipping at sunset
  const x = lerp(width * 0.16, width * 0.84, u);
  const y = height * 0.13 + sin(u * PI) * height * 0.43;

  const size = triLerpNum(84, 112, 54, u);
  const glowA = triLerpNum(16, 34, 10, u);
  const glowR = triLerpNum(3.0, 3.8, 2.3, u);
  const body = triLerp(color(50, 26, 100), color(22, 82, 100), color(46, 7, 100), u);

  noStroke();

  // soft glow, a few stacked discs
  for (let i = 4; i >= 1; i--) {
    fill(hue(body), saturation(body), brightness(body), (glowA / i) * 0.9);
    circle(x, y, size * (1 + ((glowR - 1) * i) / 4));
  }

  fill(body);
  circle(x, y, size);

}

// -------------------------------------------------------------- the ground

function groundColour(u) {
  return triLerp(color(96, 44, 42), color(24, 58, 28), color(236, 46, 11), u);
}

function paintGround(u) {
  const g = groundColour(u);
  noStroke();
  // the far ground sits in haze, so push it toward the sky colour
  fill(lerpColor(g, hazeCol, 0.5));
  rect(0, height * HORIZON, width, height * (1 - HORIZON));
}

function paintForegroundHill(u) {
  const g = groundColour(u);
  noStroke();
  fill(hue(g), saturation(g), brightness(g) * 0.55);
  ellipse(width / 2, height + 40, width * 1.6, 300);
}

// -------------------------------------------------------------- helpers

// three-stop colour ramp: a at u=0, b at u=0.5, c at u=1
function triLerp(a, b, c, u) {
  return u < 0.5 ? lerpColor(a, b, u * 2) : lerpColor(b, c, (u - 0.5) * 2);
}

function triLerpNum(a, b, c, u) {
  return u < 0.5 ? lerp(a, b, u * 2) : lerp(b, c, (u - 0.5) * 2);
}

function keyPressed() {
  if (key === "r" || key === "R") {
    forestSeed = floor(random(100000));
    makeForest();
  }
  if (key === "s" || key === "S") saveCanvas("living-forest", "png");
}