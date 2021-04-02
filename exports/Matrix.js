/**
 * 
 * @param {PIXI.Container} stage the instance of the PIXI stage
 */
function Matrix(stage) {
  PIXI.Sprite.call(this);
  this.stage = stage;
  this.state = State.getInstance();
    
  this.trameMap = new PIXI.Sprite(PIXI.Texture.fromImage("trame"));
  this.trameMap.blendMode = PIXI.BLEND_MODES.MULTIPLY;

  this.stage.addChild(this);
  this.stage.addChild(this.trameMap);   

  this.rain = [];
  this.sentence = null;  
  
  this.colorCount = 0;
  this.glitchCount = 0;
  this.glitchTrigger = 350;
  this.glitchFilter = this.createGlitchEffect(this.trameMap);
  this.filters = [this.glitchFilter];

  this.createRain();
  this.initEvents();
  this.activateEvents();
}

Matrix.prototype = Object.create(PIXI.Sprite.prototype);

/**
 * create the custom Filter from shader ( cf: index.html>shader element)
 * @returns {PIXI.Filter} the special Glitch Filter
 */
Matrix.prototype.createGlitchEffect = function (trameMap) {
  let shader = document.getElementById("shader").innerHTML;
  var glitchFilter = new PIXI.Filter(null, shader);
  
  glitchFilter.displacementMap = trameMap;
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
//   this.displacementFilter = new PIXI.filters.DisplacementFilter(displacementMap)
  return glitchFilter;
};

/**
 * create a rain of drops
 */
Matrix.prototype.createRain = function () {
  let s = State.getInstance();
  let nbDrops = s.getNbDrop();
  for (let i = 0; i < nbDrops; i++) {
    setTimeout(() => {
      this.addDrop();
    }, Math.random() * 150 * i);
  }
};

/**
 * add a new drop in the matrix 
 */
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

/**
 * activate the click/touch event
 */
Matrix.prototype.activateEvents = function () {
  this.stage.interactive = true;
};
/**
 * deactivate the click/touch event
 */
Matrix.prototype.deactivateEvents = function () {
  this.stage.interactive = false;
};
/**
 * initialize the click/touch event
 */
Matrix.prototype.initEvents = function () {
    const me = this;
    this.stage.on((this.state.isMobile?"pointertap":"click"), () => {
    // createjs.Sound.play("drop");    
    // this.deleteForce();
    // this.deactivateEvents();
    // setTimeout(()=>{me.addSentence(this.state.getRandomQuote());},1000)
    this.actionTrigger(this.state.getRandomQuote());
  });
};

Matrix.prototype.actionTrigger = function (text) {
  const me = this;
  // this.stage.on((this.state.isMobile?"pointertap":"click"), () => {
  createjs.Sound.play("drop");    
  this.deleteForce();
  this.deactivateEvents();
  setTimeout(()=>{me.addSentence(text);},1000)
// });
};


Matrix.prototype.addCommand = function (text) {
  if(this.command){
    this.removeChild(this.command);
    this.command.destroy();
    this.command= null
  }
  let com = text + ' ' + 'INFO';
  let command = new Sentence(com,text.length,true);  
  command.x = 5;
  command.y = 25;
  this.addChild(command);
  console.log(command);
  this.command = command
};
Matrix.prototype.deleteCommand = function (command) {
  console.log('this.deleteCommand')
  this.removeChild(command);
  command.destroy();
  this.command = null;
};
/**
 * add a sentence in the matrix
 * @param {object} quote the quote object {quote,author}
 */
Matrix.prototype.addSentence = function (quote) {
    let text = quote.quote + ' ' + quote.author;
  let sentence = new Sentence(text,quote.quote.length);
  sentence.x =
    Math.floor((this.state.getNbColumns() - text.length) / 2) * (Char.SIZE / 2);
  sentence.y = (Math.floor(this.state.getNbRows() / 2)-1) * (Char.SIZE);
  this.addChild(sentence);
  console.log(sentence);
  this.sentence = sentence;
};

/**
 * remove the sentence and reactivate the rain
 * @param {Sentence} sentence the sentence to delete
 */
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

/**
 * delete the drop passed in params and reAdd one if isLooping
 * @param {Drop} drop the drop to delete
 */
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

/**
 * delete all drops in the matrix
 * and force no looping
 */
Matrix.prototype.deleteForce = function () {
    this.state.isLooping = false;
  for (let i = 0; i < this.rain.length; i++) {
    this.rain[i].forceDelete();
  }
};
/**
 * update Matrix display
 */
Matrix.prototype.update = function () {
  const me = this;
  if (this.sentence) {
    this.sentence.update();
  }
  if (this.command) {
    this.command.update();
  }
  for (let i = 0; i < this.rain.length; i++) {
    this.rain[i].update();
  }
  this.colorCount++;
  if (this.colorCount >= 500) {
    this.colorCount = 0;
    if(!this.state.isRandom){
      this.state.getNewColor();
    }
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
/**
 * update the params of the Glitch Effect with random values (r,v,b) positions and orientation
 */
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
