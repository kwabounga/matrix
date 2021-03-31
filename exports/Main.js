function Main(data) {
  this.view = document.getElementById("game-canvas");
  this.stage = new PIXI.Container();
  this.state = State.getInstance();
  console.log("Main",data);
  this.state.allQuotes = data;
  console.log("this.state.allQuotes", this.state.allQuotes);

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
  this.stage.addChild(bg)
  this.loadSpriteSheet();
}

Main.prototype.update = function () {
    this.matrix.update();
  this.renderer.render(this.stage);
  requestAnimationFrame(this.update.bind(this));
};

Main.prototype.loadSpriteSheet = function () {
  //console.log(PIXI.loader);
  var loader = PIXI.loader;

  loader.add("matrix", "./assets/matrix.fnt");
  loader.once("complete", this.spriteSheetLoaded.bind(this));
  loader.load();
};

Main.prototype.spriteSheetLoaded = function () {
  this.view.style.visibility = "visible";
  this.matrix = new Matrix(this.stage, this.state);
  requestAnimationFrame(this.update.bind(this));
  
};

