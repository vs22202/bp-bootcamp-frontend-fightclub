const getImagePromise = (image) => {
  return new Promise((resolve, _) => {
    image.onload = resolve;
  });
};

const loadAllImageAssets = async () => {
  const assetPromises = [];
  canvasState.backgroundImage.src = "assets/background.jpg";
  assetPromises.push(getImagePromise(canvasState.backgroundImage));
  for (let character in spriteState) {
    for (let action in spriteState[character]) {
      const folderName = spriteState[character][action].folderName;
      for (
        let i = 0;
        i < spriteState[character][action].spriteAssets.length;
        i++
      ) {
        spriteState[character][action].spriteAssets[
          i
        ].src = `assets/${folderName}/tile0${spriteState[character][action].fileIndex}${i}.png`;
        assetPromises.push(
          getImagePromise(spriteState[character][action].spriteAssets[i])
        );
      }
    }
  }

  return Promise.all(assetPromises);
};

const drawBoundingBox = (ctx, player) => {
  ctx.beginPath();
  const {x,y,width,height} = player.getBoundingBox();
  ctx.rect(x, y, width, height);
  ctx.stroke();
};

const checkPlayerCollision = () => {

  const width = gameState.players[0].getBoundingBox().width;
  const height = gameState.players[0].getBoundingBox().height;
  if (
    Math.abs(
      gameState.players[0].getBoundingBox().x - gameState.players[1].getBoundingBox().x
    ) < width 
  ) {
    if (
      Math.abs(
        gameState.players[0].getBoundingBox().y - gameState.players[1].getBoundingBox().y
      ) < height 
    ) {
      return true;
    }
  }
};

const checkPlayerAttack = () => {
  const width = gameState.players[0].getBoundingBox().width;
  const height = gameState.players[0].getBoundingBox().height;
  if (
    Math.abs(
      gameState.players[0].getBoundingBox().x - gameState.players[1].getBoundingBox().x
    ) < width + 20 
  ) {
    if (
      Math.abs(
        gameState.players[0].getBoundingBox().y - gameState.players[1].getBoundingBox().y
      ) < height + 20 
    ) {
      return true;
    }
  }
};

const handleKeyboardInput = () => {
  for (let key in keyboardState) {
    if (keyboardState[key]) {
      if (player2ControlsList.includes(key)) {
        if (key == "q") {
          gameState.players[1].attackPlayer("attack1", gameState.players[0]);
        } else gameState.players[1].movePlayer(mapControlToDirection[key]);
      } else if (key == " ") {
        gameState.players[0].attackPlayer("attack1", gameState.players[1]);
      } else gameState.players[0].movePlayer(mapControlToDirection[key]);
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

const drawPlayer = (playerIndex) => {
  if (gameState.players[playerIndex].currentSprite.flipImage) {
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(
      gameState.players[playerIndex].currentSprite.getCurrentSprite(),
      -gameState.players[playerIndex].position.x - 200,
      gameState.players[playerIndex].position.y,
      200,
      200
    );
    ctx.restore();
  } else
    ctx.drawImage(
      gameState.players[playerIndex].currentSprite.getCurrentSprite(),
      gameState.players[playerIndex].position.x,
      gameState.players[playerIndex].position.y,
      200,
      200
    );
};

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
  handleKeyboardInput();

  //check which playerSprite Should be flipped
  gameState.players[0].currentSprite.flipImage =
    Math.abs(gameState.players[0].position.x) >
    Math.abs(gameState.players[1].position.x);
  gameState.players[1].currentSprite.flipImage =
    !gameState.players[0].currentSprite.flipImage;

  // check collision
  if (checkPlayerAttack()) {
    gameState.players[0].canAttack = true;
    gameState.players[1].canAttack = true;
  } else {
    gameState.players[0].canAttack = false;
    gameState.players[1].canAttack = false;
  }
  // console.log(
  //   canvasState.width,
  //   gameState.players[0].position.x,
  //   gameState.players[0].position.y,
  //   "hero1"
  // );

  // console.log(
  //   canvasState.width,
  //   gameState.players[1].position.x,
  //   gameState.players[1].position.y,
  //   "hero2"
  // );

  drawPlayer(0);
  drawPlayer(1);
  drawBoundingBox(ctx, gameState.players[0]);
  drawBoundingBox(ctx, gameState.players[1]);

  if (canvasState.currentFrame % 10 == 0) {
    gameState.players[0].currentSprite.incrementSprite();
    gameState.players[1].currentSprite.incrementSprite();
  }
  canvasState.currentFrame = (canvasState.currentFrame + 1) % 60;
  // Handle gravity
  gameState.players[0].movePlayer("gravity");
  gameState.players[1].movePlayer("gravity");
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
