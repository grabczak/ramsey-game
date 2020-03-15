let ctx = null;

const n = 10;
const r = 200;

function draw() {
  ctx = document.getElementById("canvas").getContext("2d");

  const points = [];

  for (let i = 0; i < n; i++) {
    points.push({
      x: r * Math.cos((2 * Math.PI * i) / n) + 250,
      y: -r * Math.sin((2 * Math.PI * i) / n) + 250
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
  ctx.beginPath();
  ctx.strokeStyle = "#CCCCCC";
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
}

function drawCircle(a, i) {
  ctx.beginPath();
  ctx.fillStyle = "#000000";
  ctx.arc(a.x, a.y, 10, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(i, a.x - 3, a.y + 3.5);
  ctx.fill();
}
