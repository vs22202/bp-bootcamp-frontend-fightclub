/* 
  Author : Vishaal Sowrirajan

  Overview of file 
  1. Setup canvas
  2. Setup sprite assets
  3. Setup game state
  4. Setup keyboard input

*/

// Setup canvas
const canvas = document.createElement("canvas");
canvas.width = 1600;
canvas.height = 720;
canvas.style.marginInline = "auto";
document.body.style.display= "flex";
document.body.style.alignItems="center";
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

// Contains the sprite assets for the characters
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
  },
};

// Game state - manages all state related to gameplay
let gameState = {
  players: [new Player(), new Player()],
  isGameStarted: false,
  isGamePaused: false,
  isGameOver: false,
  isPlayerTwoNPC: false,
  isOnlineMultiplayer: undefined,
  isOpponentReady: false,
  defaultPlayerIndex: 0,
  gameObjects: {
    healthBar: new GameObject(),
    playButton: new GameObject(),
    homeButton: new GameObject(),
    pauseButton: new GameObject(),
    selectModeButton: document.createElement("button"),
    logoutButton: document.createElement("button"),
  },
  user: new User(),
  checkRoundOver: () =>
    gameState.players[0].playerHP <= 0 || gameState.players[1].playerHP <= 0,
  addMatchOpponentUI: () => {
    const main = document.querySelector("#UI");
    main.innerHTML = "";
    if (gameState.user.id != "") sendId(gameState.user.id);
    // Create container for opponent selection
    const opponentContainer = document.createElement("div");
    opponentContainer.style.display = "flex";
    opponentContainer.style.flexDirection = "column";
    opponentContainer.style.alignItems = "center";
    opponentContainer.style.justifyContent = "center";
    opponentContainer.style.width = "300px";
    opponentContainer.style.margin = "auto";
    opponentContainer.style.padding = "20px";
    opponentContainer.style.border = "4px solid #000";
    opponentContainer.style.backgroundColor = "#1e1e1e";
    opponentContainer.style.color = "#fff";
    opponentContainer.style.fontFamily = "'Press Start 2P', cursive";
    opponentContainer.style.fontSize = "12px";
    opponentContainer.style.boxShadow = "0 0 10px #000";
    opponentContainer.style.borderRadius = "8px";

    // Create title
    const title = document.createElement("h2");
    title.innerText = "Match Opponent";
    title.style.marginBottom = "20px";
    opponentContainer.appendChild(title);

    // Create input for opponent username
    const usernameInput = document.createElement("input");
    usernameInput.type = "text";
    usernameInput.name = "opponentUsername";
    usernameInput.placeholder = "Enter Opponent Username";
    usernameInput.style.marginBottom = "10px";
    usernameInput.style.padding = "10px";
    usernameInput.style.border = "2px solid #000";
    usernameInput.style.borderRadius = "4px";
    usernameInput.style.width = "100%";
    usernameInput.style.boxSizing = "border-box";
    usernameInput.style.fontFamily = "'Press Start 2P', cursive";
    opponentContainer.appendChild(usernameInput);

    // Create button to match with entered username
    const matchButton = document.createElement("button");
    matchButton.innerText = "Match Player";
    matchButton.style.marginBottom = "10px";
    matchButton.style.padding = "10px 20px";
    matchButton.style.border = "2px solid #000";
    matchButton.style.borderRadius = "4px";
    matchButton.style.backgroundColor = "#3e3e3e";
    matchButton.style.color = "#fff";
    matchButton.style.cursor = "pointer";
    matchButton.style.fontFamily = "'Press Start 2P', cursive";
    matchButton.addEventListener("mouseover", () => {
      matchButton.style.backgroundColor = "#5e5e5e";
    });
    matchButton.addEventListener("mouseout", () => {
      matchButton.style.backgroundColor = "#3e3e3e";
    });
    matchButton.addEventListener("click", async () => {
      const opponentUsername = usernameInput.value.trim();
      if (opponentUsername) {
        console.log(`Matching with player: ${opponentUsername}`);
        const success = await gameState.user.matchWithPlayer(opponentUsername);
        if (success) {
          if (gameState.isOpponentReady) gameState.addUIElements();
        }
      } else {
        alert("Please enter a username to match with.");
      }
    });
    opponentContainer.appendChild(matchButton);

    // Create button to match with a random player
    const randomButton = document.createElement("button");
    randomButton.innerText = "Play with Random Player";
    randomButton.style.marginBottom = "10px";
    randomButton.style.padding = "10px 20px";
    randomButton.style.border = "2px solid #000";
    randomButton.style.borderRadius = "4px";
    randomButton.style.backgroundColor = "#3e3e3e";
    randomButton.style.color = "#fff";
    randomButton.style.cursor = "pointer";
    randomButton.style.fontFamily = "'Press Start 2P', cursive";
    randomButton.addEventListener("mouseover", () => {
      randomButton.style.backgroundColor = "#5e5e5e";
    });
    randomButton.addEventListener("mouseout", () => {
      randomButton.style.backgroundColor = "#3e3e3e";
    });
    randomButton.addEventListener("click", async () => {
      console.log("Matching with a random player...");
      const success = await gameState.user.matchWithRandomPlayer();
      if (success) {
        gameState.addUIElements();
      }
    });
    opponentContainer.appendChild(randomButton);

    // Create back button
    const backButton = document.createElement("button");
    backButton.innerText = "Back";
    backButton.style.marginTop = "10px";
    backButton.style.padding = "10px 20px";
    backButton.style.border = "2px solid #000";
    backButton.style.borderRadius = "4px";
    backButton.style.backgroundColor = "#3e3e3e";
    backButton.style.color = "#fff";
    backButton.style.cursor = "pointer";
    backButton.style.fontFamily = "'Press Start 2P', cursive";
    backButton.addEventListener("mouseover", () => {
      backButton.style.backgroundColor = "#5e5e5e";
    });
    backButton.addEventListener("mouseout", () => {
      backButton.style.backgroundColor = "#3e3e3e";
    });
    backButton.addEventListener("click", () => {
      gameState.addSelectModeUI();
    });
    opponentContainer.appendChild(backButton);

    // Append opponent container to main
    main.appendChild(opponentContainer);
  },
  addSelectModeUI: () => {
    const main = document.querySelector("#UI");
    main.innerHTML = "";

    // Create container for mode selection
    const modeContainer = document.createElement("div");
    modeContainer.style.display = "flex";
    modeContainer.style.flexDirection = "column";
    modeContainer.style.alignItems = "center";
    modeContainer.style.justifyContent = "center";
    modeContainer.style.width = "300px";
    modeContainer.style.margin = "auto";
    modeContainer.style.padding = "20px";
    modeContainer.style.border = "4px solid #000";
    modeContainer.style.backgroundColor = "#1e1e1e";
    modeContainer.style.color = "#fff";
    modeContainer.style.fontFamily = "'Press Start 2P', cursive";
    modeContainer.style.fontSize = "12px";
    modeContainer.style.boxShadow = "0 0 10px #000";
    modeContainer.style.borderRadius = "8px";

    // Create title
    const title = document.createElement("h2");
    title.innerText = "Select Mode";
    title.style.marginBottom = "20px";
    modeContainer.appendChild(title);

    // Create Local Multiplayer button
    const localButton = document.createElement("button");
    localButton.innerText = "Local Multiplayer";
    localButton.style.marginBottom = "10px";
    localButton.style.padding = "10px 20px";
    localButton.style.border = "2px solid #000";
    localButton.style.borderRadius = "4px";
    localButton.style.backgroundColor = "#3e3e3e";
    localButton.style.color = "#fff";
    localButton.style.cursor = "pointer";
    localButton.style.fontFamily = "'Press Start 2P', cursive";
    localButton.addEventListener("mouseover", () => {
      localButton.style.backgroundColor = "#5e5e5e";
    });
    localButton.addEventListener("mouseout", () => {
      localButton.style.backgroundColor = "#3e3e3e";
    });
    localButton.addEventListener("click", () => {
      gameState.isOnlineMultiplayer = false;
      gameState.isOpponentReady = true;
      console.log("Local Multiplayer selected");

      gameState.addUIElements();
    });
    modeContainer.appendChild(localButton);

    // Create Online Multiplayer button
    const onlineButton = document.createElement("button");
    onlineButton.innerText = "Online Multiplayer";
    onlineButton.style.marginBottom = "10px";
    onlineButton.style.padding = "10px 20px";
    onlineButton.style.border = "2px solid #000";
    onlineButton.style.borderRadius = "4px";
    onlineButton.style.backgroundColor = "#3e3e3e";
    onlineButton.style.color = "#fff";
    onlineButton.style.cursor = "pointer";
    onlineButton.style.fontFamily = "'Press Start 2P', cursive";
    onlineButton.addEventListener("mouseover", () => {
      onlineButton.style.backgroundColor = "#5e5e5e";
    });
    onlineButton.addEventListener("mouseout", () => {
      onlineButton.style.backgroundColor = "#3e3e3e";
    });
    onlineButton.addEventListener("click", () => {
      gameState.isOnlineMultiplayer = true;
      gameState.isOpponentReady = false;
      console.log("Online Multiplayer selected");

      if (gameState.user.isLoggedIn) {
        gameState.addMatchOpponentUI();
      } else {
        gameState.addLoginUI();
      }
    });
    modeContainer.appendChild(onlineButton);

    // Append mode container to main
    main.appendChild(modeContainer);
  },
  addSignUpUI: () => {
    const main = document.querySelector("#UI");
    main.innerHTML = "";

    // Create sign-up form
    const signUpForm = document.createElement("form");
    signUpForm.id = "signUpForm";
    signUpForm.style.display = "flex";
    signUpForm.style.flexDirection = "column";
    signUpForm.style.alignItems = "center";
    signUpForm.style.justifyContent = "center";
    signUpForm.style.width = "300px";
    signUpForm.style.margin = "auto";
    signUpForm.style.padding = "20px";
    signUpForm.style.border = "4px solid #000";
    signUpForm.style.backgroundColor = "#1e1e1e";
    signUpForm.style.color = "#fff";
    signUpForm.style.fontFamily = "'Press Start 2P', cursive";
    signUpForm.style.fontSize = "12px";
    signUpForm.style.boxShadow = "0 0 10px #000";
    signUpForm.style.borderRadius = "8px";

    // Create title
    const title = document.createElement("h2");
    title.innerText = "Sign Up";
    title.style.marginBottom = "20px";
    signUpForm.appendChild(title);

    // Create username input
    const usernameInput = document.createElement("input");
    usernameInput.type = "text";
    usernameInput.name = "username";
    usernameInput.placeholder = "Username";
    usernameInput.style.marginBottom = "10px";
    usernameInput.style.padding = "10px";
    usernameInput.style.border = "2px solid #000";
    usernameInput.style.borderRadius = "4px";
    usernameInput.style.width = "100%";
    usernameInput.style.boxSizing = "border-box";
    usernameInput.style.fontFamily = "'Press Start 2P', cursive";
    signUpForm.appendChild(usernameInput);

    // Create password input
    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.name = "password";
    passwordInput.placeholder = "Password";
    passwordInput.style.marginBottom = "10px";
    passwordInput.style.padding = "10px";
    passwordInput.style.border = "2px solid #000";
    passwordInput.style.borderRadius = "4px";
    passwordInput.style.width = "100%";
    passwordInput.style.boxSizing = "border-box";
    passwordInput.style.fontFamily = "'Press Start 2P', cursive";
    signUpForm.appendChild(passwordInput);

    // Create confirm password input
    const confirmPasswordInput = document.createElement("input");
    confirmPasswordInput.type = "password";
    confirmPasswordInput.name = "confirmPassword";
    confirmPasswordInput.placeholder = "Confirm Password";
    confirmPasswordInput.style.marginBottom = "20px";
    confirmPasswordInput.style.padding = "10px";
    confirmPasswordInput.style.border = "2px solid #000";
    confirmPasswordInput.style.borderRadius = "4px";
    confirmPasswordInput.style.width = "100%";
    confirmPasswordInput.style.boxSizing = "border-box";
    confirmPasswordInput.style.fontFamily = "'Press Start 2P', cursive";
    signUpForm.appendChild(confirmPasswordInput);

    // Create sign-up button
    const signUpButton = document.createElement("button");
    signUpButton.type = "submit";
    signUpButton.innerText = "Sign Up";
    signUpButton.style.padding = "10px 20px";
    signUpButton.style.border = "2px solid #000";
    signUpButton.style.borderRadius = "4px";
    signUpButton.style.backgroundColor = "#3e3e3e";
    signUpButton.style.color = "#fff";
    signUpButton.style.cursor = "pointer";
    signUpButton.style.fontFamily = "'Press Start 2P', cursive";
    signUpButton.addEventListener("mouseover", () => {
      signUpButton.style.backgroundColor = "#5e5e5e";
    });
    signUpButton.addEventListener("mouseout", () => {
      signUpButton.style.backgroundColor = "#3e3e3e";
    });
    signUpForm.appendChild(signUpButton);

    // Create back to login button
    const backToLoginButton = document.createElement("button");
    backToLoginButton.type = "button";
    backToLoginButton.innerText = "Back to Login";
    backToLoginButton.style.marginTop = "10px";
    backToLoginButton.style.padding = "10px 20px";
    backToLoginButton.style.border = "2px solid #000";
    backToLoginButton.style.borderRadius = "4px";
    backToLoginButton.style.backgroundColor = "#3e3e3e";
    backToLoginButton.style.color = "#fff";
    backToLoginButton.style.cursor = "pointer";
    backToLoginButton.style.fontFamily = "'Press Start 2P', cursive";
    backToLoginButton.addEventListener("mouseover", () => {
      backToLoginButton.style.backgroundColor = "#5e5e5e";
    });
    backToLoginButton.addEventListener("mouseout", () => {
      backToLoginButton.style.backgroundColor = "#3e3e3e";
    });
    backToLoginButton.addEventListener("click", () => {
      gameState.addLoginUI();
    });
    signUpForm.appendChild(backToLoginButton);

    // Handle form submission
    signUpForm.onsubmit = async (event) => {
      event.preventDefault();
      const username = usernameInput.value;
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;

      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      const success = await gameState.user.registerUser(username, password);
      if (success) {
        gameState.addLoginUI();
      }
    };

    // Append sign-up form to main
    main.appendChild(signUpForm);
  },
  addLoginUI: () => {
    const main = document.querySelector("#UI");
    main.innerHTML = "";

    // Create login form
    const loginForm = document.createElement("form");
    loginForm.id = "loginForm";
    loginForm.style.display = "flex";
    loginForm.style.flexDirection = "column";
    loginForm.style.alignItems = "center";
    loginForm.style.justifyContent = "center";
    loginForm.style.width = "300px";
    loginForm.style.margin = "auto";
    loginForm.style.padding = "20px";
    loginForm.style.border = "4px solid #000";
    loginForm.style.backgroundColor = "#1e1e1e";
    loginForm.style.color = "#fff";
    loginForm.style.fontFamily = "'Press Start 2P', cursive";
    loginForm.style.fontSize = "12px";
    loginForm.style.boxShadow = "0 0 10px #000";
    loginForm.style.borderRadius = "8px";

    // Create title
    const title = document.createElement("h2");
    title.innerText = "Login";
    title.style.marginBottom = "20px";
    loginForm.appendChild(title);

    // Create username input
    const usernameInput = document.createElement("input");
    usernameInput.type = "text";
    usernameInput.name = "username";
    usernameInput.placeholder = "Username";
    usernameInput.style.marginBottom = "10px";
    usernameInput.style.padding = "10px";
    usernameInput.style.border = "2px solid #000";
    usernameInput.style.borderRadius = "4px";
    usernameInput.style.width = "100%";
    usernameInput.style.boxSizing = "border-box";
    usernameInput.style.fontFamily = "'Press Start 2P', cursive";
    loginForm.appendChild(usernameInput);

    // Create password input
    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.name = "password";
    passwordInput.placeholder = "Password";
    passwordInput.style.marginBottom = "20px";
    passwordInput.style.padding = "10px";
    passwordInput.style.border = "2px solid #000";
    passwordInput.style.borderRadius = "4px";
    passwordInput.style.width = "100%";
    passwordInput.style.boxSizing = "border-box";
    passwordInput.style.fontFamily = "'Press Start 2P', cursive";
    loginForm.appendChild(passwordInput);

    // Create login button
    const loginButton = document.createElement("button");
    loginButton.type = "submit";
    loginButton.innerText = "Login";
    loginButton.style.padding = "10px 20px";
    loginButton.style.border = "2px solid #000";
    loginButton.style.borderRadius = "4px";
    loginButton.style.backgroundColor = "#3e3e3e";
    loginButton.style.color = "#fff";
    loginButton.style.cursor = "pointer";
    loginButton.style.fontFamily = "'Press Start 2P', cursive";
    loginButton.addEventListener("mouseover", () => {
      loginButton.style.backgroundColor = "#5e5e5e";
    });
    loginButton.addEventListener("mouseout", () => {
      loginButton.style.backgroundColor = "#3e3e3e";
    });
    loginForm.appendChild(loginButton);

    // Create signup button
    const signupButton = document.createElement("button");
    signupButton.type = "button";
    signupButton.innerText = "Sign Up";
    signupButton.style.marginTop = "10px";
    signupButton.style.padding = "10px 20px";
    signupButton.style.border = "2px solid #000";
    signupButton.style.borderRadius = "4px";
    signupButton.style.backgroundColor = "#3e3e3e";
    signupButton.style.color = "#fff";
    signupButton.style.cursor = "pointer";
    signupButton.style.fontFamily = "'Press Start 2P', cursive";
    signupButton.addEventListener("mouseover", () => {
      signupButton.style.backgroundColor = "#5e5e5e";
    });
    signupButton.addEventListener("mouseout", () => {
      signupButton.style.backgroundColor = "#3e3e3e";
    });
    signupButton.addEventListener("click", () => {
      gameState.addSignUpUI();
    });
    loginForm.appendChild(signupButton);

    // Handle form submission
    loginForm.onsubmit = async (event) => {
      event.preventDefault();
      const username = usernameInput.value;
      const password = passwordInput.value;
      const success = await gameState.user.loginUser(username, password);

      if (success) {
        if (gameState.isOnlineMultiplayer) {
          gameState.addMatchOpponentUI();
        } else {
          gameState.addSelectModeUI();
        }
      }
    };

    // Append login form to main
    main.appendChild(loginForm);
  },
  addUIElements: () => {
    const main = document.querySelector("#UI");
    main.innerHTML = "";

    // Add button to navigate to Select Mode page
    const selectModeButton = gameState.gameObjects.selectModeButton;
    selectModeButton.innerText = "Select Mode";
    selectModeButton.style.marginTop = "10px";
    selectModeButton.style.padding = "10px 20px";
    selectModeButton.style.border = "2px solid #000";
    selectModeButton.style.borderRadius = "4px";
    selectModeButton.style.backgroundColor = "#3e3e3e";
    selectModeButton.style.color = "#fff";
    selectModeButton.style.cursor = "pointer";
    selectModeButton.style.fontFamily = "'Press Start 2P', cursive";
    selectModeButton.addEventListener("mouseover", () => {
      selectModeButton.style.backgroundColor = "#5e5e5e";
    });
    selectModeButton.addEventListener("mouseout", () => {
      selectModeButton.style.backgroundColor = "#3e3e3e";
    });
    const logoutButton = gameState.gameObjects.logoutButton;
    logoutButton.innerText = "Logout";
    logoutButton.style.marginTop = "10px";
    logoutButton.style.padding = "10px 20px";
    logoutButton.style.border = "2px solid #000";
    logoutButton.style.borderRadius = "4px";
    logoutButton.style.backgroundColor = "#3e3e3e";
    logoutButton.style.color = "#fff";
    logoutButton.style.cursor = "pointer";
    logoutButton.style.fontFamily = "'Press Start 2P', cursive";
    logoutButton.style.display = gameState.user.isLoggedIn ? "block" : "none";
    logoutButton.addEventListener("mouseover", () => {
      logoutButton.style.backgroundColor = "#5e5e5e";
    });
    logoutButton.addEventListener("mouseout", () => {
      logoutButton.style.backgroundColor = "#3e3e3e";
    });
    logoutButton.addEventListener("click", () => {
      gameState.user.logoutUser();
      gameState.addSelectModeUI();
    });
    main.appendChild(logoutButton);
    gameState.gameObjects.playButton.asset.id = "playButton";
    main.appendChild(gameState.gameObjects.playButton.asset);
    gameState.gameObjects.playButton.asset.addEventListener("click", () => {
      gameState.isGameStarted = true;
      gameState.gameObjects.pauseButton.asset.style.display = "block";
      gameState.gameObjects.playButton.asset.style.display = "none";
      selectModeButton.style.display = "none";
      logoutButton.style.display = "none";
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

    selectModeButton.addEventListener("click", () => {
      gameState.addSelectModeUI();
    });
    main.appendChild(selectModeButton);
  },
  clearUI: () => {
    const main = document.querySelector("#UI");
    main.innerHTML = "";
  },
  resetGameState: () => {
    gameState.addSelectModeUI();
    gameState.players = [new Player(), new Player()];
    gameState.isGameStarted = false;
    gameState.isGamePaused = false;
    gameState.isGameOver = false;
    gameState.isPlayerTwoNPC = false;
    gameState.gameObjects.playButton.asset.style.display = "block";
    gameState.gameObjects.selectModeButton.style.display = "block";
    gameState.gameObjects.selectModeButton.style.display = gameState.user
      .isLoggedIn
      ? "block"
      : "none";
    gameState.gameObjects.pauseButton.asset.style.display = "none";
    gameState.players[0].position.x = 0;
    gameState.players[0].position.y = canvasState.baseLine - 100;

    gameState.players[1].position.x = canvasState.width - 200;
    gameState.players[1].position.y = canvasState.baseLine - 100;
    gameState.players[1].currentSprite.character = "windNinja";
    gameState.players[1].currentSprite.flipImage = true;
  },
};

gameState.players[0].position.x = 0;
gameState.players[0].position.y = canvasState.baseLine - 100;

gameState.players[1].position.x = canvasState.width - 200;
gameState.players[1].position.y = canvasState.baseLine - 100;
gameState.players[1].currentSprite.character = "windNinja";
gameState.players[1].currentSprite.flipImage = true;

// Handles all keyboard input and triggers the respective actions

// Some constants for tirggering the right action based on some keys
const player2ControlsList = ["w", "a", "s", "d", "q"];
const player1ControlsList = [
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  " ",
];
const mapControlToDirection = {
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowUp: "up",
  ArrowDown: "down",
  " ": "attack1",
  w: "up",
  a: "left",
  s: "down",
  d: "right",
  q: "attack1",
};

const keyboardState = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  ArrowDown: false,
  w: false,
  a: false,
  s: false,
  d: false,
  handleKeyboardInput: () => {
    for (let key in keyboardState) {
      if (keyboardState[key]) {
        const defaultPlayerIndex = gameState.isOnlineMultiplayer
          ? gameState.defaultPlayerIndex
          : 0;
        const opposingPlayerIndex = defaultPlayerIndex == 0 ? 1 : 0;
        if (key == " ") {
          gameState.players[defaultPlayerIndex].attackPlayer(
            "attack1",
            gameState.players[opposingPlayerIndex]
          );
          if (gameState.isOnlineMultiplayer) {
            sendMessage(key);
            sendPosition();
          }
        }
        for (let i = 0; i < player1ControlsList.length - 1; i++) {
          if (player1ControlsList[i] == key) {
            gameState.players[defaultPlayerIndex].movePlayer(
              mapControlToDirection[key],
              gameState.players[opposingPlayerIndex]
            );
            if (gameState.isOnlineMultiplayer) {
              sendPosition();
            }
            break;
          }
        }

        if (!gameState.isOnlineMultiplayer) {
          if (key == "q") {
            gameState.players[1].attackPlayer("attack1", gameState.players[0]);
          }
          for (let i = 0; i < player2ControlsList.length - 1; i++) {
            if (player2ControlsList[i] == key) {
              gameState.players[1].movePlayer(
                mapControlToDirection[key],
                gameState.players[0]
              );
              break;
            }
          }
        }
      }
    }
  },
};
