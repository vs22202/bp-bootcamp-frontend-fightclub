const socket = new WebSocket("ws://localhost:6969/ws");


socket.onopen = () => {
  console.log("Connected to server");
};
socket.onmessage = (message) => {
  if(message.data.includes("You are")){
    gameState.defaultPlayerIndex = parseInt(message.data[message.data.length-1]) - 1;
    console.log("here")
    gameState.gameObjects.playButton.asset.click();
  }
  const key = message.data.replaceAll('\x00','');
  if(player1ControlsList.includes(key)){
    const opposingPlayerIndex = gameState.defaultPlayerIndex == 0 ? 1 : 0;
    if(key == " "){
        gameState.players[opposingPlayerIndex].attackPlayer("attack1", gameState.players[gameState.defaultPlayerIndex]);
    }
    gameState.players[opposingPlayerIndex].movePlayer(
      mapControlToDirection[key],
      gameState.players[gameState.defaultPlayerIndex]
    );
  }

  console.log("Received message:", message);
};
socket.onclose = () => {
  console.log("Disconnected from server");
};

const sendMessage = (keyCode) =>{
    if(socket.readyState === WebSocket.OPEN) socket.send(keyCode);
}
