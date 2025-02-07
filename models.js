/* 
  Author : Vishaal Sowrirajan

  Overview of file:
  1. Position Model : This model is used to store x and y coordinates
  2. SpriteSize Model : This model is used to store width and height of a sprite
  3. Sprite Model : This model is used to store the current sprite of a player and perform actions on it
  4. Player Model : This model is used to store player details and perform actions on it
  5. GameObject Model : This model is used to store game object details

*/
function Position() {
  this.x = 0;
  this.y = 0;
}

function SpriteSize() {
  this.width = 200;
  this.height = 200;
}
function Sprite() {
  this.character = "ronan";
  this.action = "idle";
  this.currentSpriteIndex = 0;
  this.flipImage = false;
  this.spriteSize = new SpriteSize();
  this.getCurrentSprite = () => {
    return spriteState[this.character][this.action].spriteAssets[
      this.currentSpriteIndex
    ];
  };
  this.incrementSprite = () => {
    if (this.action == "idle")
      this.currentSpriteIndex =
        (this.currentSpriteIndex + 1) %
        spriteState[this.character][this.action].spriteAssets.length;
    else if (this.action == "dead") {
      this.currentSpriteIndex = this.currentSpriteIndex + 1;
      if (
        this.currentSpriteIndex >=
        spriteState[this.character][this.action].spriteAssets.length
      ) {
        this.currentSpriteIndex =
          spriteState[this.character][this.action].spriteAssets.length - 1;
      }
    } else {
      this.currentSpriteIndex = this.currentSpriteIndex + 1;
      if (
        this.currentSpriteIndex >=
        spriteState[this.character][this.action].spriteAssets.length
      ) {
        this.currentSpriteIndex = 0;
        this.action = "idle";
      }
    }
  };
}

function Player() {
  this.playerName = `Random Name ${Math.floor(Math.random() * 1000)}`;
  this.playerScore = 0;
  this.playerHP = 100;
  this.speed = 5;
  this.jumpMultiplier = 3;
  this.maxJumpHeight = 500;
  this.gravityMultiplier = 1;
  this.position = new Position();
  this.currentSprite = new Sprite();
  this.isFalling = false;
  this.isRising = false;
  this.isTakingDamage = false;
  this.canAttack = false;
  this.attackRange = 60;
  this.boundingBoxOffsets = {
    xOffset: this.currentSprite.spriteSize.width / 2.7,
    yOffset: this.currentSprite.spriteSize.height / 20,
  };

  this.getBoundingBox = () => {
    return {
      x: this.position.x + this.boundingBoxOffsets.xOffset,
      y: this.position.y + this.boundingBoxOffsets.yOffset,
      width:
        this.currentSprite.spriteSize.width -
        2 * this.boundingBoxOffsets.xOffset,
      height:
        this.currentSprite.spriteSize.height - this.boundingBoxOffsets.yOffset,
    };
  };

  this.checkPlayerCollision = (otherPlayer) => {
    const width = this.getBoundingBox().width;
    const height = this.getBoundingBox().height;
    if (
      Math.abs(this.getBoundingBox().x - otherPlayer.getBoundingBox().x) < width
    ) {
      if (
        Math.abs(this.getBoundingBox().y - otherPlayer.getBoundingBox().y) <
        height
      ) {
        return true;
      }
    }

    return false;
  };

  this.checkPlayerAttack = (enemyPlayer) => {
    const width = this.getBoundingBox().width;
    const height = this.getBoundingBox().height;
    if (
      Math.abs(this.getBoundingBox().x - enemyPlayer.getBoundingBox().x) <
      width + this.attackRange
    ) {
      if (
        Math.abs(this.getBoundingBox().y - enemyPlayer.getBoundingBox().y) <
        height + this.attackRange
      ) {
        return true;
      }
    }
    return false;
  };

  this.movePlayer = (direction, otherPlayer) => {
    const oldPos = new Position();
    oldPos.x = this.position.x;
    oldPos.y = this.position.y;

    switch (direction) {
      case "left":
        this.position.x -= this.speed;
        if (this.position.x < 0) this.position.x = 0;
        break;
      case "right":
        this.position.x += this.speed;
        if (this.position.x > canvasState.width - 200)
          this.position.x = canvasState.width - 200;
        break;
      case "up":
        if (this.isFalling) return;
        this.isRising = true;
        break;
      case "down":
        this.position.y += this.speed * this.jumpMultiplier;
        if (this.position.y > canvasState.baseLine - 200)
          this.position.y = canvasState.baseLine - 200;
        break;
      case "gravity":
        if (this.isRising) {
          if (this.position.y > canvasState.baseLine - this.maxJumpHeight)
            this.position.y -= this.speed * this.jumpMultiplier;
          if (this.position.y <= canvasState.baseLine - this.maxJumpHeight) {
            this.isFalling = true;
            this.isRising = false;
          }
        } else {
          this.position.y += this.speed * this.gravityMultiplier;
          if (this.position.y > canvasState.baseLine - 200) {
            this.position.y = canvasState.baseLine - 200;
            this.isFalling = false;
          }
        }
        break;
    }

    if (this.checkPlayerCollision(otherPlayer)) {
      this.position.x = oldPos.x;
      this.position.y = oldPos.y;
    }
  };

  this.attackPlayer = (attackType, playerToBeAttacked) => {
    if (this.currentSprite.action !== attackType) {
      this.currentSprite.action = attackType;
      this.currentSprite.currentSpriteIndex = 0;

      if (this.canAttack) {
        if (playerToBeAttacked.playerHP > 0) {
          playerToBeAttacked.playerHP -= 10;

          setTimeout(() => {
            playerToBeAttacked.isTakingDamage = true;
          }, 300);
          setTimeout(() => {
            playerToBeAttacked.isTakingDamage = false;
          }, 800);
        }
        if (playerToBeAttacked.playerHP <= 0) {
          setTimeout(() => {
            playerToBeAttacked.currentSprite.action = "dead";
          }, 200);
        }
      }
    }
  };
}

function GameObject() {
  this.position = new Position();
  this.asset = new Image();
}
