// This piece of code is interesting as it creates a rotating "@" symbol that changes colour as it rotates, resembling a rainbow springy toy.

i=0,k=225;
// i tracks how far we've rotated so far (also reused for color); 
// k is a fixed size used both for text size and as the center point of the canvas

function setup(){
    createCanvas(450,450); // makes a 450x450px canvas
    textSize(k); // sets text size to 225px, since k=225
    colorMode(HSB, 360, 100, 100); // switch colour mode to HSB
    //frameRate(20);
}

function draw(){
    //background(220, 25);
    translate(k,k); // moves the origin (0,0) to the center of the canvas
    fill(i % 360, 80, 100); // sets fill colour: hue cycles through the color wheel as i grows, high saturation/brightness
    rotate(i+=+50); // increases i by 50, then rotates the canvas by that new i value (in radians)
    text("@",99,0)  // draws "@" 99px to the right of center, at the now-rotated angle
}
