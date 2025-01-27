
/* */
// Image assets laoder
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

// Keyboard events handler
document.addEventListener("keydown", (event) => {
  keyboardState[event.key] = true;
});

document.addEventListener("keyup", (event) => {
  keyboardState[event.key] = false;
});


// Screen setup

// Start screen setup
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

// Game Screen setup
const setupGameStage = (ctx) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    canvasState.backgroundImage,
    0,
    0,
    canvasState.width,
    canvasState.height
  );

  // check which playerSprite should be flipped
  gameState.players[0].currentSprite.flipImage =
    Math.abs(gameState.players[0].position.x) >
    Math.abs(gameState.players[1].position.x);
  gameState.players[1].currentSprite.flipImage =
    !gameState.players[0].currentSprite.flipImage;

  // check if other player is in attack range
  gameState.players[0].canAttack = gameState.players[0].checkPlayerAttack(
    gameState.players[1]
  );
  gameState.players[1].canAttack = gameState.players[1].checkPlayerAttack(
    gameState.players[0]
  );

  drawPlayer(0);
  drawPlayer(1);
  drawHealthBars();

  // handle player sprite animation
  if (canvasState.currentFrame % 6 == 0) {
    gameState.players[0].currentSprite.incrementSprite();
    gameState.players[1].currentSprite.incrementSprite();
  }
  canvasState.currentFrame = (canvasState.currentFrame + 1) % 60;

  // handle gravity
  gameState.players[0].movePlayer("gravity",gameState.players[1]);
  gameState.players[1].movePlayer("gravity",gameState.players[0]);

  if (gameState.checkRoundOver()) {
    gameState.isGameOver = true;
  }
};

//Game state handlers
const handleGamePause = () => {
  drawGameStateText("Game Paused");
};

const handleGameOver = () => {
  drawGameStateText("Game Over");
  setTimeout(() => {
    drawGameStateText("Restarting Now....");
    gameState.resetGameState();
  }, 2000);
};

const gameLoop = (timestamp) => {
  if (gameState.isGameStarted) setupGameStage(ctx);
  else setupStartupScreen();

  if (gameState.isGamePaused) {
    handleGamePause();
  } else if (gameState.isGameOver) {
    handleGameOver();
  } else keyboardState.handleKeyboardInput();

  requestAnimationFrame(gameLoop);
};

loadAllImageAssets().then(() => {
  gameState.addUIElements();
  requestAnimationFrame(gameLoop);
});
