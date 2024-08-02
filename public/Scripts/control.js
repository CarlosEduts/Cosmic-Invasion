const currentURL = window.location.href;
const playerID = currentURL.substring(currentURL.indexOf("game") + 85);
var socket = io();

const buttons = {
  screen: document.querySelector(".screen-control"),
  left: document.querySelector(".left-control"),
  right: document.querySelector(".right-control"),
  beam: document.querySelector(".beam-control"),
};

const sound = {
  click: new Audio("../Game/Audio/click_003.ogg"),
  laser: new Audio("../Game/Audio/laserSmall_001.ogg"),
};

// Conectar ao Servidor
socket.on("connect", () => {
  let action = ["Connect", true];
  socket.emit("sendAction", { playerID, action });
});

// Função do som de Clique
function clickSound() {
  sound.click
    .play()
    .then(() => {})
    .catch((error) => {
      // Tente carregar novamente o áudio em caso de falha
      sound.click.load();
      sound.click.play();
    });
}

// Movimentar o jogador para a Esquerda
buttons.left.addEventListener("touchstart", () => {
  let action = ["Left", true];
  socket.emit("sendAction", { playerID, action });
  clickSound();
});

buttons.left.addEventListener("touchend", () => {
  let action = ["Left", false];
  socket.emit("sendAction", { playerID, action });
});

// Movimentar o jogador para a Direita
buttons.right.addEventListener("touchstart", () => {
  let action = ["Right", true];
  socket.emit("sendAction", { playerID, action });
  clickSound();
});

buttons.right.addEventListener("touchend", () => {
  let action = ["Right", false];
  socket.emit("sendAction", { playerID, action });
});

// Função do som do Laser
function laserSound() {
  sound.laser
    .play()
    .then(() => {})
    .catch((error) => {
      // Tente carregar novamente o áudio em caso de falha
      sound.laser.load();
      sound.laser.play();
    });
}

// Botão de atirar laser
buttons.beam.addEventListener("touchstart", () => {
  let action = ["Beam", true];
  socket.emit("sendAction", { playerID, action });
  laserSound();
});

// Evento de tela cheia
buttons.screen.addEventListener("click", function () {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    document.documentElement.mozRequestFullScreen();
  } else if (document.documentElement.webkitRequestFullscreen) {
    document.documentElement.webkitRequestFullscreen();
  } else if (document.documentElement.msRequestFullscreen) {
    document.documentElement.msRequestFullscreen();
  }
  clickSound();
});
