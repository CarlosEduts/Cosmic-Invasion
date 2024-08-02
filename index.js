const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const PORT = process.env.PORT || 3000;

// Serve os arquivos estáticos
app.use(express.static("public"));

const users = {};
io.on("connection", (socket) => {
  console.log("Um usuário se conectou:", socket.id);

  socket.on("register", (userId) => {
    users[userId] = socket.id;
    console.log(`Usuário registrado: ${userId} com socket ID: ${socket.id}`);
  });

  socket.on("sendAction", (data) => {
    const toUserId = data.playerID;
    const action = data.action;
    const toSocketId = users[toUserId];

    if (toSocketId) {
      io.to(toSocketId).emit("receiveAction", {
        fromUserId: socket.userId,
        action,
      });
      console.log(`Ação enviada para ${toUserId}: ${action}`);
    } else {
      console.log(`Usuário ${toUserId} não encontrado`);
    }
  });

  socket.on("disconnect", () => {
    console.log("Um usuário se desconectou:", socket.id);
    // Remover o usuário desconectado da lista de usuários
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
  });
});

//Iniciar Servidor
server.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}`);
});
