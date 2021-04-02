/**
 * Object Main
 * @param {object} data from json quote file
 */
function Main(data) {
  this.view = document.getElementById("game-canvas");
  this.stage = new PIXI.Container();
  this.state = State.getInstance();
  this.state.allQuotes = data;

  this.renderer = PIXI.autoDetectRenderer(this.state.width, this.state.height, {
    view: this.view,
  });
  this.renderer.backgroundColor = 0x000000;
  let bg = new PIXI.Sprite(PIXI.Texture.WHITE);
  // Set it to fill the screen
  bg.width = this.state.width;
  bg.height = this.state.height;
  // Tint it to whatever color you want, here red
  bg.tint = 0x000000;
  this.stage.addChild(bg);
  this.loadSpriteSheet();
}

/**
 * Main loop updater 
 */
Main.prototype.update = function () {
  this.matrix.update();
  this.renderer.render(this.stage);
  requestAnimationFrame(this.update.bind(this));
};

/**
 * sprite sheet loader
 */
Main.prototype.loadSpriteSheet = function () {
  var loader = PIXI.loader;

  loader.add("matrix", "./assets/matrix.fnt");
  loader.add("trame", "./assets/trame.jpg");
  // loader.add("screen", "./assets/screen.png");
  // loader.add("displacement", "./assets/displacement.png");
  loader.once("complete", this.spriteSheetLoaded.bind(this));
  loader.load();
};
/**
 * sprite sheet loader handler
 */
Main.prototype.spriteSheetLoaded = function () {
  const me =this;
  this.view.style.visibility = "visible";
  this.matrix = new Matrix(this.stage, this.state);
  this.addKeysEvents();
  requestAnimationFrame(this.update.bind(this));
  setTimeout(() => {
    me.matrix.actionTrigger({quote:"What is the Matrix", author:"neo"})
  }, 100);
  if(!this.state.isMobile){
    this.matrix.addCommand('PRESS R V B C SPACE OR CLICK');
  }
};





// TESTING

Main.prototype.addKeysEvents = function () {
  console.log("adding key Events r, v, b, c, (Red, Blue, Green, Custom)");

  this.keyRed = keyboard("r");
  this.keyGreen = keyboard("v");
  this.keyBlue = keyboard("b");
  this.keyCustom = keyboard("c");
  this.keyRandom = keyboard(" ");
//  ["#ed0039",
//  "#44b5ff",
//  "#7cfc00"]
  this.keyRed.press = () => {
    console.log("Red pressed");
    this.matrix.addCommand('RED');
    this.state.currentColor = "#ed0039";    
  };
  this.keyGreen.press = () => {
    console.log("Green pressed");
    this.matrix.addCommand('GREEN');
    this.state.currentColor = "#7cfc00";    
  };
  this.keyBlue.press = () => {
    console.log("blue pressed");
    this.matrix.addCommand('BLUE');
    this.state.currentColor = "#44b5ff";    
  };
  this.keyCustom.press = () => {
    console.log("Custom pressed");
    this.matrix.addCommand('CUSTOM COLOR');
    this.state.currentColor = this.state.customColor;    
  };
  this.keyRandom.press = () => {
    console.log("Random pressed");
    this.state.isRandom = !this.state.isRandom;    
    this.matrix.addCommand(`RANDOM ${this.state.isRandom?'DEACTIVATED':'ACTIVATED'}`);
  };

}


