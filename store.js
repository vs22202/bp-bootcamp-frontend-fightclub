const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

const canvasState = {
  width: canvas.width,
  height: canvas.height,
  backgroundImage: new Image(),
  fps: 60,
  currentFrame: 0,
  baseLine: canvas.height - 70,
};

const spriteState = {
  ronan: {
    idle: {
      fileIndex: 0,
      folderName: "sprites_ronan",
      spriteAssets: Array(10)
        .fill(0)
        .map(() => new Image()),
    },
    dead: {
      fileIndex: 4,
      folderName: "sprites_ronan",
      spriteAssets: Array(10)
        .fill(0)
        .map(() => new Image()),
    },
    attack1: {
      fileIndex: 3,
      folderName: "sprites_ronan",
      spriteAssets: Array(10)
        .fill(0)
        .map(() => new Image()),
    },
  },
  windNinja: {
    idle: {
      fileIndex: 0,
      folderName: "sprites_wind_ninja",
      spriteAssets: Array(10)
        .fill(0)
        .map(() => new Image()),
    },
    dead: {
      fileIndex: 4,
      folderName: "sprites_wind_ninja",
      spriteAssets: Array(10)
        .fill(0)
        .map(() => new Image()),
    },
    attack1: {
      fileIndex: 3,
      folderName: "sprites_wind_ninja",
      spriteAssets: Array(10)
        .fill(0)
        .map(() => new Image()),
    },
  },
};

let gameState = {
  players: [new Player(), new Player()],
  isGameStarted: false,
  isGamePaused: false,
  isGameOver: false,
  isPlayerTwoNPC: false,
  gameObjects: {
    healthBar: new GameObject(),
    playButton: new GameObject(),
    homeButton: new GameObject(),
    pauseButton: new GameObject(),
  },
  checkRoundOver: () =>
    gameState.players[0].playerHP <= 0 || gameState.players[1].playerHP <= 0,
  addUIElements: () => {
    const main = document.querySelector("#UI");
    gameState.gameObjects.playButton.asset.id = "playButton";
    main.appendChild(gameState.gameObjects.playButton.asset);
    gameState.gameObjects.playButton.asset.addEventListener("click", () => {
      gameState.isGameStarted = true;
      gameState.gameObjects.pauseButton.asset.style.display = "block";
      gameState.gameObjects.playButton.asset.style.display = "none";
    });
    gameState.gameObjects.pauseButton.asset.id = "pauseButton";
    main.appendChild(gameState.gameObjects.pauseButton.asset);
    gameState.gameObjects.pauseButton.asset.addEventListener("click", () => {
      gameState.isGamePaused = !gameState.isGamePaused;
      if (!gameState.isGamePaused)
        gameState.gameObjects.pauseButton.asset.src =
          "assets/game_objects/buttons/pause_button.png";
      else
        gameState.gameObjects.pauseButton.asset.src =
          "assets/game_objects/buttons/play_button.png";
    });
  },
};

gameState.players[0].position.x = canvasState.width / 2;
gameState.players[0].position.y = canvasState.baseLine - 100;

gameState.players[1].position.x = canvasState.width / 2 + 200;
gameState.players[1].position.y = canvasState.baseLine - 100;
gameState.players[1].currentSprite.character = "windNinja";
gameState.players[1].currentSprite.flipImage = true;

const player2ControlsList = ["w", "a", "s", "d", "q"];
const mapControlToDirection = {
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowUp: "up",
  ArrowDown: "down",
  " ": "attack1",
  w: "up",
  a: "left",
  s: "down",
  d: "right",
  q: "attack1",
};

const keyboardState = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  ArrowDown: false,
  w: false,
  a: false,
  s: false,
  d: false,
  handleKeyboardInput: () => {
    for (let key in keyboardState) {
      if (keyboardState[key]) {
        if (player2ControlsList.includes(key)) {
          if (key == "q") {
            gameState.players[1].attackPlayer("attack1", gameState.players[0]);
          } else
            gameState.players[1].movePlayer(
              mapControlToDirection[key],
              gameState.players[0]
            );
        } else if (key == " ") {
          gameState.players[0].attackPlayer("attack1", gameState.players[1]);
        } else
          gameState.players[0].movePlayer(
            mapControlToDirection[key],
            gameState.players[1]
          );
      }
    }
  },
};
