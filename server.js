const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const PORT = 3000;

app.use(express.static("client"));

let players = {};

io.on("connection", socket => {
  console.log(\`Player connected: \${socket.id}\`);

  players[socket.id] = {
    x: Math.random() * 1000,
    y: Math.random() * 1000,
    radius: 30,
    id: socket.id
  };

  socket.on("move", data => {
    if (players[socket.id]) {
      players[socket.id].x = data.x;
      players[socket.id].y = data.y;
    }
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    console.log(\`Player disconnected: \${socket.id}\`);
  });
});

setInterval(() => {
  io.emit("state", players);
}, 1000 / 60); // 60 FPS

http.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
