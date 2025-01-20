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

const movePlayer = (playerIndex, direction) => {
  console.log(direction, playerIndex);
  switch (direction) {
    case "left":
      gameState.players[playerIndex].position.x -=
        gameState.players[playerIndex].speed;
      if (gameState.players[playerIndex].position.x < 0)
        gameState.players[playerIndex].position.x = 0;
      break;
    case "right":
      gameState.players[playerIndex].position.x +=
        gameState.players[playerIndex].speed;
      if (gameState.players[playerIndex].position.x > canvasState.width - 200)
        gameState.players[playerIndex].position.x = canvasState.width - 200;
      break;
    case "up":
      if (
        gameState.players[playerIndex].isFalling &&
        gameState.players[playerIndex].position.y === canvasState.baseLine - 200
      ) {
        gameState.players[playerIndex].isFalling = false;
      }
      if (
        gameState.players[playerIndex].position.y >
          canvasState.height / 2 - 100 &&
        !gameState.players[playerIndex].isFalling
      )
        gameState.players[playerIndex].position.y -=
          gameState.players[playerIndex].speed *
          gameState.players[playerIndex].jumpMultiplier;
      else gameState.players[playerIndex].isFalling = true;
      break;
    case "down":
      gameState.players[playerIndex].position.y +=
        gameState.players[playerIndex].speed *
        gameState.players[playerIndex].jumpMultiplier;
      if (
        gameState.players[playerIndex].position.y >
        canvasState.baseLine - 200
      )
        gameState.players[playerIndex].position.y = canvasState.baseLine - 200;
      break;
  }
};

const attackPlayer = (playerIndex, attackType) => {
  if (gameState.players[playerIndex].canAttack) {
    const oppositePlayerIndex = Number(!playerIndex);
    if (gameState.players[oppositePlayerIndex].playerHP > 0) {
      gameState.players[oppositePlayerIndex].playerHP -= 10;
    }
    if (gameState.players[oppositePlayerIndex].playerHP <= 0) {
      setTimeout(() => {
        gameState.players[oppositePlayerIndex].currentSprite.action = "dead";
      }, 200);
      setTimeout(() => {
        gameState.isGameOver = true;
      }, 200);
    }
  }
  if (gameState.players[playerIndex].currentSprite.action !== attackType) {
    gameState.players[playerIndex].currentSprite.action = attackType;
    gameState.players[playerIndex].currentSprite.currentSpriteIndex = 0;
  }
};

const handleKeyboardInput = () => {
  for (let key in keyboardState) {
    if (keyboardState[key]) {
      if (player2ControlsList.includes(key)) {
        if (key == "q") {
          attackPlayer(1, "attack1");
        } else movePlayer(1, mapControlToDirection[key]);
      } else if (key == " ") {
        attackPlayer(0, "attack1");
      } else movePlayer(0, mapControlToDirection[key]);
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

const checkPlayerCollision = () => {
  if (
    Math.abs(
      gameState.players[0].position.x - gameState.players[1].position.x
    ) < 100
  ) {
    gameState.players[0].canAttack = true;
    gameState.players[1].canAttack = true;
  }
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
  console.log(gameState, "hero");
  handleKeyboardInput();

  //check which playerSprite Should be flipped
  gameState.players[0].currentSprite.flipImage =
    Math.abs(gameState.players[0].position.x) >
    Math.abs(gameState.players[1].position.x);
  gameState.players[1].currentSprite.flipImage =
    !gameState.players[0].currentSprite.flipImage;

  // check collision
  checkPlayerCollision();
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

  if (canvasState.currentFrame % 10 == 0) {
    gameState.players[0].currentSprite.incrementSprite();
    gameState.players[1].currentSprite.incrementSprite();
  }
  canvasState.currentFrame = (canvasState.currentFrame + 1) % 60;
  // Handle gravity
  gameState.players[0].position.y +=
    gameState.players[0].speed * gameState.players[0].gravityMultiplier;
  if (gameState.players[0].position.y > canvasState.baseLine - 200)
    gameState.players[0].position.y = canvasState.baseLine - 200;

  gameState.players[1].position.y +=
    gameState.players[1].speed * gameState.players[1].gravityMultiplier;
  if (gameState.players[1].position.y > canvasState.baseLine - 200)
    gameState.players[1].position.y = canvasState.baseLine - 200;
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
