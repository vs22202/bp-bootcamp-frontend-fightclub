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
  }

};


let gameState = {
  players: [new Player(), new Player()],
  isGameStarted: false,
  isGamePaused: false,
  isGameOver: false,
  isPlayerTwoNPC: true,
  gameObjects: {
    healthBar: new GameObject(),
    playButton: new GameObject(),
    homeButton: new GameObject(),
    pauseButton: new GameObject(),
  }
};

gameState.players[0].position.x = canvasState.width / 2;
gameState.players[0].position.y = canvasState.baseLine - 100;

gameState.players[1].playerName = "Player 2";
gameState.players[1].position.x = canvasState.width / 2 + 200;
gameState.players[1].position.y = canvasState.baseLine - 100;
gameState.players[1].currentSprite.character =  "windNinja";
gameState.players[1].currentSprite.flipImage = true;

const player2ControlsList = ["w", "a", "s", "d","q"];
const mapControlToDirection = {
  "ArrowLeft": "left",
  "ArrowRight":"right",
  "ArrowUp": "up",
  "ArrowDown":"down",
  " ": "attack1",
  "w": "up",
  "a": "left",
  "s": "down",
  "d": "right",
  "q": "attack1",
}
const keyboardState = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  ArrowDown: false,
  w:false,
  a:false,
  s:false,
  d:false,
};
