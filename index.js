let canvas = null;
let context = null;
let input = null;

const r = 200;
let n = 6;

function run() {
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");

  input = document.getElementById("input");
  input.addEventListener("input", e => {
    const value = e.target.value;

    if (value >= 3 && value <= 25) {
      n = value;
      draw();
    }
  });

  draw();
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  const points = [];

  for (let i = 0; i < n; i++) {
    points.push({
      x: r * Math.cos((2 * Math.PI * i) / n) + canvas.width / 2,
      y: -r * Math.sin((2 * Math.PI * i) / n) + canvas.width / 2
    });
  }

  for (const a of points) {
    for (const b of points) {
      drawLine(a, b);
    }
  }

  for (const [i, a] of points.entries()) {
    drawCircle(a, i);
  }
}

function drawLine(a, b) {
  context.beginPath();
  context.strokeStyle = "#CCCCCC";
  context.moveTo(a.x, a.y);
  context.lineTo(b.x, b.y);
  context.stroke();
}

function drawCircle(a, i) {
  context.beginPath();
  context.fillStyle = "#000000";
  context.arc(a.x, a.y, 10, 0, 2 * Math.PI);
  context.fill();
  context.beginPath();
  context.fillStyle = "#FFFFFF";
  context.fillText(i, a.x - 3, a.y + 3.5);
  context.fill();
}
