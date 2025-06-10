const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const socket = io();

let players = {};
let myId = null;

document.addEventListener("mousemove", e => {
  const x = e.clientX;
  const y = e.clientY;
  socket.emit("move", {
    x: x,
    y: y
  });
});

socket.on("state", data => {
  players = data;
  if (!myId && socket.id in data) myId = socket.id;
});

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let id in players) {
    const p = players[id];
    const isMe = id === myId;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = isMe ? "#4CAF50" : "#2196F3";
    ctx.fill();
    ctx.stroke();
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
