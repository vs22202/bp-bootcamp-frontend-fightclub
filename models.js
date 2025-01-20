function Position() {
  this.x = 0;
  this.y = 0;
}

function Sprite() {
  this.character = "ronan";
  this.action = "idle";
  this.currentSpriteIndex = 0;
  this.flipImage = false;
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
  this.gravityMultiplier = 1;
  this.position = new Position();
  this.currentSprite = new Sprite();
  this.isFalling = false;
  this.canAttack = false;
}
