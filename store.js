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
  baseLine: canvas.height - 100,
};

const spriteState = {
  ronan: {
    idle: {
      fileIndex: 0,
      spriteAssets: Array(10)
        .fill(0)
        .map(() => new Image()),
    },
    dead: {
      fileIndex: 4,
      spriteAssets: Array(10)
        .fill(0)
        .map(() => new Image()),
    },
    attack1: {
      fileIndex: 3,
      spriteAssets: Array(10)
        .fill(0)
        .map(() => new Image()),
    },
  },

};

let gameState = {
  players: [new Player(), new Player()],
  isGamePaused: false,
  isGameOver: false,
  isPlayerTwoNPC: true,
};

gameState.players[0].position.x = canvasState.width / 2;
gameState.players[0].position.y = canvasState.baseLine - 100;

const keyboardState = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  ArrowDown: false,
};
