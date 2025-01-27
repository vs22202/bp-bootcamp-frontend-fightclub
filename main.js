const loadAllImageAssets = async () => {
  const assetPromises = [];
  canvasState.backgroundImage.src = "assets/background.png";
  gameState.gameObjects.healthBar.asset.src =
    "assets/game_objects/greenbar.png";
  gameState.gameObjects.playButton.asset.src =
    "assets/game_objects/buttons/play_button.png";
  gameState.gameObjects.pauseButton.asset.src =
    "assets/game_objects/buttons/pause_button.png";
  gameState.gameObjects.homeButton.asset.src =
    "assets/game_objects/buttons/home_button.png";
  assetPromises.push(getImagePromise(canvasState.backgroundImage));
  assetPromises.push(getImagePromise(gameState.gameObjects.healthBar.asset));
  assetPromises.push(getImagePromise(gameState.gameObjects.playButton.asset));
  assetPromises.push(getImagePromise(gameState.gameObjects.pauseButton.asset));
  assetPromises.push(getImagePromise(gameState.gameObjects.homeButton.asset));

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
  const { x, y, width, height } = player.getBoundingBox();
  ctx.rect(x, y, width, height);
  ctx.stroke();
};

const checkPlayerCollision = () => {
  const width = gameState.players[0].getBoundingBox().width;
  const height = gameState.players[0].getBoundingBox().height;
  if (
    Math.abs(
      gameState.players[0].getBoundingBox().x -
        gameState.players[1].getBoundingBox().x
    ) < width
  ) {
    if (
      Math.abs(
        gameState.players[0].getBoundingBox().y -
          gameState.players[1].getBoundingBox().y
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
      gameState.players[0].getBoundingBox().x -
        gameState.players[1].getBoundingBox().x
    ) <
    width + 20
  ) {
    if (
      Math.abs(
        gameState.players[0].getBoundingBox().y -
          gameState.players[1].getBoundingBox().y
      ) <
      height + 20
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

const handleGameOver = () => {
  drawGameStateText("Game Over");
  setTimeout(() => {
    drawGameStateText("Restarting Now....");
    location.reload();
  }, 2000);
};

const drawHealthBars = () => {
  const player1HealthBarWidth = gameState.players[0].playerHP * 10.5;
  const player2HealthBarWidth = gameState.players[1].playerHP * 10.5;

  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.drawImage(
    gameState.gameObjects.healthBar.asset,
    -1050 / 8,
    -120,
    1050,
    500
  );
  ctx.restore();
  ctx.drawImage(
    gameState.gameObjects.healthBar.asset,
    -player1HealthBarWidth / 8,
    -120,
    player1HealthBarWidth,
    500
  );
  ctx.font = "40px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("Player 1", 25, 80);
  ctx.save();
  ctx.scale(-1, 1);
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.drawImage(
    gameState.gameObjects.healthBar.asset,
    -canvasState.width - 1050 / 8,
    -120,
    1050,
    500
  );
  ctx.restore();
  ctx.drawImage(
    gameState.gameObjects.healthBar.asset,
    -canvasState.width - player2HealthBarWidth / 8,
    -120,
    player2HealthBarWidth,
    500
  );
  ctx.font = "40px Arial";
  ctx.fillStyle = "black";
  ctx.restore();
  const textWidth = ctx.measureText("Player 2").width;
  ctx.fillText("Player 2", canvasState.width - textWidth - 25, 80);
};

const drawPlayer = (playerIndex) => {
  if (gameState.players[playerIndex].isTakingDamage) {
    ctx.filter = "saturate(7)";
  }

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

  ctx.filter = "none";
};

const checkRoundOver = () => {
  return (
    gameState.players[0].playerHP <= 0 || gameState.players[1].playerHP <= 0
  );
};
const setupStartupScreen = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    canvasState.backgroundImage,
    0,
    0,
    canvasState.width,
    canvasState.height
  );
};
const drawGameStateText = (text) => {
  ctx.fillStyle = "black";
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.fillRect(0, 0, canvasState.width, canvasState.height);
  ctx.restore();
  ctx.font = "90px Arial";
  const textWidth = ctx.measureText(text).width;
  ctx.fillText(
    text,
    canvasState.width / 2 - textWidth / 2,
    canvasState.height / 2
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

  drawPlayer(0);
  drawPlayer(1);
  drawHealthBars();
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
  if (checkRoundOver()) {
    gameState.isGameOver = true;
  }
};

const handleGamePause = () => {
  drawGameStateText("Game Paused");
};

const gameLoop = (timestamp) => {
  if (gameState.isGameStarted) setupGameStage(ctx);
  else setupStartupScreen();

  if (gameState.isGamePaused) {
    handleGamePause();
  } else if (gameState.isGameOver) {
    handleGameOver();
  } else handleKeyboardInput();

  requestAnimationFrame(gameLoop);
};

const addUIElements = () => {
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
};

loadAllImageAssets().then(() => {
  addUIElements();
  requestAnimationFrame(gameLoop);
});
