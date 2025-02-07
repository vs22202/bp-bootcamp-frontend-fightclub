/* 
  Author : Vishaal Sowrirajan

  Overview of file 
  1. Setup canvas
  2. Setup sprite assets
  3. Setup game state
  4. Setup keyboard input

*/

// Setup canvas
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

// Contains the sprite assets for the characters
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

// Game state - manages all state related to gameplay
let gameState = {
  players: [new Player(), new Player()],
  isGameStarted: false,
  isGamePaused: false,
  isGameOver: false,
  isPlayerTwoNPC: false,
  isOnlineMultiplayer: true,
  defaultPlayerIndex: 0,
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
  resetGameState: () => {
    gameState.players = [new Player(), new Player()];
    gameState.isGameStarted = false;
    gameState.isGamePaused = false;
    gameState.isGameOver = false;
    gameState.isPlayerTwoNPC = false;
    gameState.gameObjects.playButton.asset.style.display = "block";
    gameState.gameObjects.pauseButton.asset.style.display = "none";
    gameState.players[0].position.x = canvasState.width / 2;
    gameState.players[0].position.y = canvasState.baseLine - 100;

    gameState.players[1].position.x = canvasState.width / 2 + 200;
    gameState.players[1].position.y = canvasState.baseLine - 100;
    gameState.players[1].currentSprite.character = "windNinja";
    gameState.players[1].currentSprite.flipImage = true;
  },
};

gameState.players[0].position.x = canvasState.width / 2;
gameState.players[0].position.y = canvasState.baseLine - 100;

gameState.players[1].position.x = canvasState.width / 2 + 200;
gameState.players[1].position.y = canvasState.baseLine - 100;
gameState.players[1].currentSprite.character = "windNinja";
gameState.players[1].currentSprite.flipImage = true;

// Handles all keyboard input and triggers the respective actions

// Some constants for tirggering the right action based on some keys
const player2ControlsList = ["w", "a", "s", "d", "q"];
const player1ControlsList = [
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  " ",
];
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
        if (key == " ") {
          gameState.players[0].attackPlayer("attack1", gameState.players[1]);
        }
        const defaultPlayerIndex = gameState.isOnlineMultiplayer ? gameState.defaultPlayerIndex : 0;
        const opposingPlayerIndex = defaultPlayerIndex == 0 ? 1 : 0;
        for (let i = 0; i < player1ControlsList.length - 1; i++) {
          if (player1ControlsList[i] == key) {
            gameState.players[defaultPlayerIndex].movePlayer(
              mapControlToDirection[key],
              gameState.players[opposingPlayerIndex]
            );
            if(gameState.isOnlineMultiplayer){
              sendMessage(key);
            }
            break;
          }
        }

        if (!gameState.isOnlineMultiplayer) {
          if (key == "q") {
            gameState.players[1].attackPlayer("attack1", gameState.players[0]);
          }
          for (let i = 0; i < player2ControlsList.length - 1; i++) {
            if (player2ControlsList[i] == key) {
              gameState.players[1].movePlayer(
                mapControlToDirection[key],
                gameState.players[0]
              );
              break;
            }
          }
        }
      }
    }
  },
};
