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
  ctx.fillText(gameState.players[0].playerName, 25, 80);
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
  const textWidth = ctx.measureText(gameState.players[1].playerName).width;
  ctx.fillText(
    gameState.players[1].playerName,
    canvasState.width - textWidth - 25,
    80
  );
};

// dev helper function
const drawBoundingBox = (ctx, player) => {
  ctx.beginPath();
  const { x, y, width, height } = player.getBoundingBox();
  ctx.rect(x, y, width, height);
  ctx.stroke();
};
