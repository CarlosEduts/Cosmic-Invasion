var socket = io();
const containers = {
  home: document.querySelector(".home-container"),
  game: document.querySelector(".game-container"),
  over: document.querySelector(".game-over-container"),
};

const content = {
  spaceship: document.querySelector(".player"),
  spaceshipIMG: document.querySelector(".player-spaceship"),
  beam: document.querySelector(".beam"),
  enemies: document.querySelectorAll(".enemy"),
  overTime: document.querySelector(".over-time"),
  navTime: document.querySelector(".nav-time"),
  navPoints: document.querySelector(".nav-points"),
};

const config = {
  pixel: 64,
};

const page = {
  width: window.innerWidth - config.pixel,
  height: window.innerHeight,
};

const player = {
  id: randomNum(9999999999),
  beam: { y: 5, x: 0 },
  points: 0,
  speed: 16,
  time: 18,
  x: 40,
};

// Função que gera números aleatórios
function randomNum(value) {
  return Math.round(Math.random() * value);
}

// Temporizador do jogo (Conta tempo de vida do Jogador, se menor que ZERO: Fim de jogo)
function timer() {
  player.time = 18;

  let Interval = setInterval(() => {
    player.time -= 1;
    content.navTime.innerText = `${player.time}s`;

    if (player.time <= 0) {
      clearInterval(Interval);
      gameOver();
    }
  }, 1000);
}

// Tela de Fim de Jogo
function gameOver() {
  content.spaceshipIMG.backgroundImage = "url(../Game/Effects/Explosion.gif)";
  content.overTime.innerText = `Você conseguiu ${player.points} Pontos!`;
  containers.over.style.display = "flex";
  containers.game.style.display = "none";

  setTimeout(() => {
    window.location.reload();
  }, 5000);
}

// Define a direção do Foguete
function spaceshipDirection(direction) {
  content.spaceshipIMG.style.backgroundImage = `url(../Game/Player/Player_ship-${direction}.png)`;
}

// Movimenta o Jogador
function playerMove(direction) {
  if (player.x < 1) {
    player.x = page.width;
  } else if (player.x >= page.width) {
    player.x = 0;
  }

  if (direction === "Left") {
    player.x -= player.speed;
    spaceshipDirection("left");
  } else if (direction === "Right") {
    player.x += player.speed;
    spaceshipDirection("right");
  }
  content.spaceship.style.left = `${player.x}px`;
}

// Testa se o inimigo foi acertado e gara um novo inimigo
function enemyHit() {
  const margin = config.pixel / 2;

  for (var i = 0; i < content.enemies.length; i++) {
    const enemyLeft = Number(content.enemies[i].style.left.replace(/\D/g, ""));
    const enemyBottom = Number(
      content.enemies[i].style.bottom.replace(/\D/g, "")
    );

    if (
      player.beam.y >= enemyBottom - margin &&
      player.beam.y <= enemyBottom + margin &&
      player.beam.x >= enemyLeft - margin &&
      player.beam.x <= enemyLeft + margin
    ) {
      renderEnemy(content.enemies[i]);
    }
  }
}

// Disparar laser pelo Fogute
function playerShoots() {
  player.beam.x = player.x;
  player.beam.y = config.pixel;
  content.beam.style.left = `${player.beam.x}px`;
  content.beam.style.display = "block";
  spaceshipDirection("front");

  const interval = setInterval(() => {
    player.beam.y += player.speed;
    content.beam.style.bottom = `${player.beam.y}px`;
    enemyHit();
  }, 100);

  setTimeout(() => {
    clearInterval(interval);
  }, 5000);
}

// renderizar inimigo na Tela
function renderEnemy(enemy) {
  const enemiesName = ["Alan", "Bon_Bon", "Lips"];
  content.beam.style.backgroundImage = "url(../Game/Effects/Sparkle.gif)";
  content.navPoints.innerText = `${player.points}`;
  content.navTime.innerText = `${player.time}s + 2s`;
  player.time += 2;
  player.points += 85;

  setTimeout(() => {
    content.beam.style.backgroundImage = "url(../Game/Player/Player_beam.png)";
  }, 20);

  enemy.style.left = `${randomNum(page.width)}px`;
  enemy.style.bottom = `${
    randomNum(page.height - 5 * config.pixel) + config.pixel * 3
  }px`;
  enemy.style.backgroundImage = `url(../Game/Enemies/${
    enemiesName[randomNum(2)]
  }.gif)`;
}

// Função com o codigo para iniciar o jogo
function start() {
  for (var i = 0; i < content.enemies.length; i++) {
    renderEnemy(content.enemies[i]);
  }
  containers.home.style.display = "none";
  containers.game.style.display = "block";
  player.points = 0;
  timer();
}

// Identifica a ação feita pelo jogador
let intervalId;
function buttonAction(action, move) {
  // Se o contole foi conetado
  if (action == "Connect") {
    start();
  } else if (action == "Beam") {
    playerShoots();
  } else if (move) {
    intervalId = setInterval(() => {
      playerMove(action);
    }, 50);
  } else {
    clearInterval(intervalId);
  }
}

// Registrar o usuário com um ID específico
socket.on("connect", () => {
  socket.emit("register", player.id);
});

// Recebe dados do socket.io
socket.on("receiveAction", (data) => {
  const { fromUserId, action } = data;
  buttonAction(action[0], action[1]);
});

// Cria um elemento de imagem e define o src com a URL do QR code
const currentURL = window.location.href;
const url = `${currentURL}/control.html?id=${player.id}`;
QRCode.toDataURL(url, (err, url) => {
  if (err) throw err;
  const img = document.createElement("img");
  img.src = url;
  document.querySelector(".qrcode").appendChild(img);
});
