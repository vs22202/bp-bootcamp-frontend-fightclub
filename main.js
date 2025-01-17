const getImagePromise = (image) => {
  return new Promise((resolve, _) => {
    image.onload = resolve;
  });
};

const loadAllImageAssets = async () => {
  const assetPromises = [];
  canvasState.backgroundImage.src = "assets/background.jpg";
  assetPromises.push(getImagePromise(canvasState.backgroundImage));
  for (let action in spriteState.ronan) {
    for (let i = 0; i < spriteState.ronan[action].spriteAssets.length; i++) {
      spriteState.ronan[action].spriteAssets[
        i
      ].src = `assets/sprites_ronan/tile0${spriteState.ronan[action].fileIndex}${i}.png`;
      assetPromises.push(
        getImagePromise(spriteState.ronan[action].spriteAssets[i])
      );
    }
  }

  return Promise.all(assetPromises);
};

const handleKeyboardInput = () => {
  if (keyboardState["ArrowLeft"]) {
    gameState.players[0].position.x -= gameState.players[0].speed;
    if (gameState.players[0].position.x < 0)
      gameState.players[0].position.x = 0;
  }
  if (keyboardState["ArrowRight"]) {
    gameState.players[0].position.x += gameState.players[0].speed;
    if (gameState.players[0].position.x > canvasState.width - 200)
      gameState.players[0].position.x = canvasState.width - 200;
  }
  if (keyboardState["ArrowUp"]) {
    if (
      gameState.players[0].isFalling &&
      gameState.players[0].position.y === canvasState.baseLine - 200
    ) {
      gameState.players[0].isFalling = false;
    }
    if (
      gameState.players[0].position.y > canvasState.height / 2 - 100 &&
      !gameState.players[0].isFalling
    )
      gameState.players[0].position.y -=
        gameState.players[0].speed * gameState.players[0].jumpMultiplier;
    else gameState.players[0].isFalling = true;
  }
  if (keyboardState["ArrowDown"]) {
    gameState.players[0].position.y +=
      gameState.players[0].speed * gameState.players[0].jumpMultiplier;
    if (gameState.players[0].position.y > canvasState.baseLine - 200)
      gameState.players[0].position.y = canvasState.baseLine - 200;
  }
  if (keyboardState[" "]) {
    if (gameState.players[0].currentSprite.action !== "attack1") {
      gameState.players[0].currentSprite.action = "attack1";
      gameState.players[0].currentSprite.currentSpriteIndex = 0;
    }
  }
};

document.addEventListener("keydown", (event) => {
  keyboardState[event.key] = true;
});

document.addEventListener("keyup", (event) => {
  keyboardState[event.key] = false;
});

const handleGameOver = () => {};

const setupGameStage = (ctx) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    canvasState.backgroundImage,
    0,
    0,
    canvasState.width,
    canvasState.height
  );
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, canvasState.baseLine, canvasState.width, 10);
  console.log(gameState, "hero");
  handleKeyboardInput();
  console.log(
    canvasState.width,
    gameState.players[0].position.x,
    gameState.players[0].position.y,
    "hero"
  );

  const player1Sprite = gameState.players[0].currentSprite.getCurrentSprite();

  ctx.drawImage(
    player1Sprite,
    gameState.players[0].position.x,
    gameState.players[0].position.y,
    200,
    200
  );
  if (canvasState.currentFrame % 10 == 0)
    gameState.players[0].currentSprite.incrementSprite();
  canvasState.currentFrame = (canvasState.currentFrame + 1) % 60;
  gameState.players[0].position.y +=
    gameState.players[0].speed * gameState.players[0].gravityMultiplier;
  if (gameState.players[0].position.y > canvasState.baseLine - 200)
    gameState.players[0].position.y = canvasState.baseLine - 200;
};

const gameLoop = (ctx) => {
  setupGameStage(ctx);

  if (gameState.isGamePaused) {
    handleGamePause();
  } else if (gameState.isGameOver) {
    handleGameOver();
  }
};

loadAllImageAssets().then(() => {
  setInterval(() => {
    gameLoop(ctx);
  }, 1000 / canvasState.fps);
});
