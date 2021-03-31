function Matrix(stage) {
  PIXI.Sprite.call(this);

  this.stage = stage;
  this.stage.addChild(this);
  this.state = State.getInstance();

  this.rain = [];
  this.sentence = null;  
  
  this.colorCount = 0;
  this.glitchCount = 0;
  this.glitchTrigger = 350;

  this.glitchFilter = this.createGlitchEffect();
  this.filters = [this.glitchFilter];

  this.createRain();
  this.initEvents();
  this.activateEvents();
}

Matrix.prototype = Object.create(PIXI.Sprite.prototype);

Matrix.prototype.createGlitchEffect = function () {
  let shader = document.getElementById("shader").innerHTML;
  var glitchFilter = new PIXI.Filter(null, shader);
  glitchFilter.autoFit = true;
  glitchFilter.blendMode = PIXI.BLEND_MODES.HARD_LIGHT;
  glitchFilter.padding = 0;
  glitchFilter.enabled = false;
  glitchFilter.uniforms.aspect = 1;
  glitchFilter.uniforms.fillMode = 2;
  glitchFilter.uniforms.cosDir = 0.33;
  glitchFilter.uniforms.fillMode = 2;
  glitchFilter.uniforms.blue = new Float32Array([10, -4]);
  glitchFilter.uniforms.red = new Float32Array([2, 2]);
  glitchFilter.uniforms.green = new Float32Array([-10, 4]);
  glitchFilter.uniforms.dimensions = new Float32Array([
    this.state.width,
    this.state.height,
  ]);
  glitchFilter.uniforms.seed = parseFloat("0.5");
  glitchFilter.uniforms.offset = 100;

  return glitchFilter;
};

Matrix.prototype.createRain = function () {
  let s = State.getInstance();
  let nbDrops = s.getNbDrop();
  for (let i = 0; i < nbDrops; i++) {
    setTimeout(() => {
      this.addDrop();
    }, Math.random() * 150 * i);
  }
};

Matrix.prototype.addDrop = function () {
    if(!this.state.isLooping)return;
  if (this.rain.length < this.state.getNbColumns()) {
    let d = new Drop();
    this.addChild(d);
    d.x =
      (Math.floor(Math.random() * this.state.getNbColumns()) * Char.SIZE) / 2;
    d.y = this.state.getRandomY();
    this.rain.push(d);
  }
};

Matrix.prototype.activateEvents = function () {
  this.stage.interactive = true;
};

Matrix.prototype.desactivateEvents = function () {
  this.stage.interactive = false;
};

Matrix.prototype.initEvents = function () {
    const me = this;
    this.stage.on((this.state.isMobile?"pointertap":"click"), () => {
    console.log("NbDrop:", this.state.getNbDrop(true));
    createjs.Sound.play("drop");
    
    this.deleteForce();
    this.desactivateEvents();
    setTimeout(()=>{me.addSentence(this.state.getRandomQuote());},1000)
  });
};

Matrix.prototype.addSentence = function (quote) {
    let text = quote.quote + ' ' + quote.author;
  let sentence = new Sentence(text,quote.quote.length);
  sentence.x =
    Math.floor((this.state.getNbColumns() - text.length) / 2) * (Char.SIZE / 2);
  sentence.y = Math.floor(this.state.getNbRows() / 2) * Char.SIZE;
  this.addChild(sentence);
  console.log(sentence);
  this.sentence = sentence;
};

Matrix.prototype.deleteSentence = function (sentence) {
  this.sentence = null;
  this.removeChild(sentence);
  sentence.destroy();
  setTimeout(() => {
    this.createRain();
    this.activateEvents();
    this.state.isLooping = true;
  }, Tools.randomBetween(100, 1000));
};
Matrix.prototype.deleteDrop = function (drop) {
  var index = this.rain.indexOf(drop);
  if (index > -1) {
    this.rain.splice(index, 1);
    this.removeChild(drop);
    drop.destroy();
  }
  if (this.state.isLooping) {
    this.addDrop();
  }
};

Matrix.prototype.deleteForce = function () {
    this.state.isLooping = false;
  for (let i = 0; i < this.rain.length; i++) {
    this.rain[i].forceDelete();
  }
};
Matrix.prototype.update = function () {
  const me = this;
  if (this.sentence) {
    this.sentence.update();
  }
  for (let i = 0; i < this.rain.length; i++) {
    this.rain[i].update();
  }
  this.colorCount++;
  if (this.colorCount >= 500) {
    this.colorCount = 0;
    this.state.getNewColor();
  }
  this.glitchCount++;
  if (this.glitchCount >= this.glitchTrigger) {
    this.glitchTrigger = Math.floor(Math.random() * 350) + 100;
    this.glitchCount = 0;
    this.updateGlitch();
    this.glitchFilter.enabled = true;
    setTimeout(() => {

      me.glitchFilter.enabled = false;
      me.updateGlitch();
      setTimeout(() => {

        me.glitchFilter.enabled = true;
        setTimeout(() => {

          me.glitchFilter.enabled = false;
          me.glitchCount = 0;
        }, Math.random() * 250);
      }, Math.random() * 100);
    }, Math.random() * 500);
  }
};
Matrix.prototype.updateGlitch = function () {
  this.glitchFilter.uniforms.blue = new Float32Array([
    Tools.randomBetween(),
    Tools.randomBetween(),
  ]);
  this.glitchFilter.uniforms.red = new Float32Array([
    Tools.randomBetween(),
    Tools.randomBetween(),
  ]);
  this.glitchFilter.uniforms.green = new Float32Array([
    Tools.randomBetween(),
    Tools.randomBetween(),
  ]);
  this.glitchFilter.uniforms.dirCos = Math.cos(Math.random() * 360);
};