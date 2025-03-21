const socket = new WebSocket(config.BACKEND_WS_URL || "ws://localhost:4001/ws");

socket.onopen = () => {
  console.log("Connected to server");
};
socket.onmessage = (message) => {
  if (message.data.includes("You are")) {
    gameState.defaultPlayerIndex =
      parseInt(message.data[message.data.length - 1]) - 1;
    console.log("here");
    gameState.gameObjects.playButton.asset.click();
  }
  if (message.data[0] === "W") {
    alert("Waiting for opponent player to join");
    gameState.isOpponentReady = false;
  }
  const key = message.data.replaceAll("\x00", "");
  if (key == "?") {
    if (confirm("You have been challenged to a match do u accept?")) {
      fetch(`${config.BACKEND_REST_API_URL}/playerAcceptMatch`, {
        method: "POST",
        body: `Y${gameState.user.id}`,
      });
    } else {
      fetch(`${config.BACKEND_REST_API_URL}/playerAcceptMatch`, {
        method: "POST",
        body: `N${gameState.user.id}`,
      });
    }
  } else if (key[0] == "S") {
    alert("Opponent is ready, starting game!!");
    gameState.isOpponentReady = true;

    const opposingPlayerIndex = gameState.defaultPlayerIndex == 0 ? 1 : 0;
    console.log(key, "name");
    gameState.players[opposingPlayerIndex].playerName = key.slice(1);
    gameState.players[gameState.defaultPlayerIndex].playerName = "You";

    gameState.clearUI();
    gameState.isGameStarted = true;
  } else if (key == "R") {
    alert("Opponent has rejected the match, try a different player");
  } else if (key[0] == "P") {
    const opposingPlayerIndex = gameState.defaultPlayerIndex == 0 ? 1 : 0;
    const [posx, posy] = key.slice(1).split("|");
    console.log(key);
    console.log(posx);
    gameState.players[opposingPlayerIndex].position.x = parseFloat(posx);
    gameState.players[opposingPlayerIndex].position.y = parseFloat(posy);
  } else if (key[0] == "H") {
    const opposingPlayerIndex = gameState.defaultPlayerIndex == 0 ? 1 : 0;
    const hp = parseFloat(key.slice(1).split("|"));
    console.log(key);
    console.log(posx);
    gameState.players[opposingPlayerIndex].playerHP = parseFloat(hp);
  } else if (key == " ") {
    const opposingPlayerIndex = gameState.defaultPlayerIndex == 0 ? 1 : 0;
    gameState.players[opposingPlayerIndex].attackPlayer(
      "attack1",
      gameState.players[gameState.defaultPlayerIndex]
    );
  }
  // if (player1ControlsList.includes(key)) {
  //   const opposingPlayerIndex = gameState.defaultPlayerIndex == 0 ? 1 : 0;
  //   if (key == " ") {
  //     gameState.players[opposingPlayerIndex].attackPlayer(
  //       "attack1",
  //       gameState.players[gameState.defaultPlayerIndex]
  //     );
  //   }
  //   gameState.players[opposingPlayerIndex].movePlayer(
  //     mapControlToDirection[key],
  //     gameState.players[gameState.defaultPlayerIndex]
  //   );
  // }

  console.log("Received message:", message);
};
socket.onclose = () => {
  console.log("Disconnected from server");
};

const sendId = (player_id) => {
  if (socket.readyState === WebSocket.OPEN) socket.send(`_${player_id}`);
};

const sendGameOver = () => {
  if (socket.readyState === WebSocket.OPEN) socket.send(`x`);
};
const sendMessage = (keyCode) => {
  if (socket.readyState === WebSocket.OPEN) socket.send(keyCode);
};
const sendPosition = () => {
  if (socket.readyState == WebSocket.OPEN)
    socket.send(
      `P${gameState.players[gameState.defaultPlayerIndex].position.x}|${
        gameState.players[gameState.defaultPlayerIndex].position.y
      }`
    );
};
const sendHp = () => {
  const opposingPlayerIndex = gameState.defaultPlayerIndex == 0 ? 1 : 0;
  if (socket.readyState == WebSocket.OPEN)
    socket.send(`H${gameState.players[opposingPlayerIndex].playerHP}`);
};
