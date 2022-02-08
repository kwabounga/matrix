
  /**
   * MATRIX
   * 
   * @author kwa 
   * @description matrix rain & quotes 
   * @version 1.0.2 
   * @see http://kwabounga.fr/matrix 
   * @last_update Tue, 08 Feb 2022 22:04:16 GMT
   * @licence ISC 
   * 
   */
  
  
/* [Keyboard.js] ... begin */
function keyboard(value) {
    let key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event => {
      if (event.key === key.value) {
        if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;
        event.preventDefault();
      }
    };
  
    //The `upHandler`
    key.upHandler = event => {
      if (event.key === key.value) {
        if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
        event.preventDefault();
      }
    };
  
    //Attach event listeners
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);
    
    window.addEventListener(
      "keydown", downListener, false
    );
    window.addEventListener(
      "keyup", upListener, false
    );
    
    // Detach event listeners
    key.unsubscribe = () => {
      window.removeEventListener("keydown", downListener);
      window.removeEventListener("keyup", upListener);
    };
    
    return key;
  }
/* ... end [Keyboard.js] */

/* added by combiner */

/* [tools.js] ... begin */
var Tools = Tools || {};

/**
 * return the real size of the current browser window
 */
Tools.availableSize = {
    width: _=> Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    height: _=> Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
}
/**
 * randomBetween
 * @param {integer} max 
 * @param {integer} min 
 * @returns a integer between min and max
 */
Tools.randomBetween = function(min=-40, max=40){
    return (Math.random() * (max-min) + min);
  }
/**
 * random boolean
 * @param {integer} max 
 * @returns boolean 
 */
Tools.rb = function(max=15) {
  return !(Math.floor(Math.random()*max) > max/3);
}
/**
 * ajaxGet
 * @param {string} url 
 * @param {function} callback 
 */
Tools.ajaxGet = function(url, callback) {
    var req = new XMLHttpRequest();
    req.open("GET", url);
    req.addEventListener("load", function () {
      if (req.status >= 200 && req.status < 400) {
        // console.log(url + ' ...loaded');
        // Appelle la fonction callback en lui passant la réponse de la requête
        callback(req.responseText);
      } else {
        // console.error(req.status + " " + req.statusText + " " + url);
      }
    });
    req.addEventListener("error", function () {
      // console.error("Erreur réseau avec l'URL " + url);
    });
    req.send(null);
  }
  /**
   * 
   * @returns if client is on mobile or not
   */
  Tools.isMobile = function(){
    console.log(navigator.userAgent)
    let rg = new RegExp(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile Safari/ig)
    let isMob = rg.test(navigator.userAgent)
    // console.log(isMob)
    return isMob;
  }
  
/* ... end [tools.js] */

/* added by combiner */

/* [Sentence.js] ... begin */
/**
 * Sentence Object
 * @param {string} text the text to display (quote + author)
 * @param {integer} limitQuote the position of the quote's end
 */
function Sentence (text, limitQuote,isCommand = false) {
    PIXI.Sprite.call(this);
    this.allChars = [];
    this.isCommand = isCommand;
    let f = new PIXI.filters.NoiseFilter();
        f.blendMode = PIXI.BLEND_MODES.ADD;
        f.noise = 0.59;
        f.seed = 0.33;
        f.autoFit = true;
        this.filters = [f];
    this.limitQuote = limitQuote;
    this.createSentence(text.toUpperCase(),(isCommand?0:5))
}
Sentence.prototype = Object.create(PIXI.Sprite.prototype);

/**
 * 
 * @param {string} text the text to display
 * @param {integer} nbDropLeft the number of drops still present on the screen
 */
Sentence.prototype.createSentence = function(text, nbDropLeft = 5,isCommand = false){
    let state = State.getInstance();
    const me = this;
    for (let i = 0; i < text.length+1; i++) {
        let outOfRange = (i===text.length);
        setTimeout(()=>{
            const t = (outOfRange?null:text[i]);
            let c = new Char((350+(nbDropLeft*20)), (outOfRange?Math.floor(Math.random()*100):null), t);
            c.x = i * (Char.SIZE/2);
            c.y = (-(Char.SIZE+5))
            me.addChild(c);
            me.allChars.push(c);
            createjs.Sound.play("frap_"+Math.ceil(Math.random()*4));
            if((i > this.limitQuote) && !outOfRange){
                c.color(state.currentColor)
            }
        },(50*i))
    }
}
/**
 * update the sentence display
 */
Sentence.prototype.update = function(){
    const me = this;
    let l = me.allChars.length;
    for (let i = 0; i < l; i++) {
        if(me.allChars[i])me.allChars[i].update();
    }
    // this.allChars.forEach((char)=>{
    //     char.update();
    // })
}

/**
 * 
 * @param {Char} char the character to delete
 */
Sentence.prototype.removeChar = function(char){
    // console.log('this.removeChar')
    var index = this.allChars.indexOf(char);
    if (index > -1) {
        this.allChars.splice(index, 1);
    }
    this.removeChild(char);
    char.destroy();
    if(this.allChars.length === 0 ){
        if(this.isCommand){
            this.parent.deleteCommand(this);
        } else {
            this.parent.deleteSentence(this);
        }
    }
}
/* ... end [Sentence.js] */

/* added by combiner */

/* [Drop.js] ... begin */
/**
 * Drop Object
 */
function Drop () {
    PIXI.Sprite.call(this);
    this.allChars = [];
    this.size = Math.max((Math.floor(Math.random()*20)+10),Math.floor(Math.random()*50))
    this.cLength = (Math.random() * 300)+50;
    
    this.createDropChar(this.size);
    this.state = State.getInstance();
    if(Tools.rb(5)){
        
        // BG
        let f = new PIXI.filters.BlurFilter(Tools.randomBetween(0,20),3,3);
        f.blendMode = PIXI.BLEND_MODES.HARD_LIGHT;
        f.autoFit = true;
        this.filters = [f];

        
    } else {
        // FG
        // let f = new PIXI.filters.NoiseFilter();
        // f.blendMode = PIXI.BLEND_MODES.ADD;
        // f.noise = 0.59;
        // f.seed = 0.33;
        // f.autoFit = true;
        // this.filters = [f];
    }
}

Drop.prototype = Object.create(PIXI.Sprite.prototype);

/**
 * update drop display
 */
Drop.prototype.update = function(){
    const me = this;
    let l = me.allChars.length;
    for (let i = 0; i < l; i++) {
        if(me.allChars[i])me.allChars[i].update();
    }
    // this.allChars.forEach((char)=>{
    //     char.update();
    // })
}
/**
 * 
 * @returns {integer} the size, in character, of the current drop
 */
Drop.prototype.getSize = function(){
    return this.size;
}

/**
 * forceDelete
 * force the drop to disappear
 */
Drop.prototype.forceDelete = function(){
    const me = this;
    let l = me.allChars.length;
    for (let i = 0; i < l; i++) {
        const char = me.allChars[i]
        setTimeout(()=>{
            char.cycleLength = 0;
            },(Tools.randomBetween(0,20)*i))            
        
    }
}
/**
 * 
 * @param {Char} char the character to delete
 */
Drop.prototype.removeChar = function(char){
    
    var index = this.allChars.indexOf(char);
    if (index > -1) {
        this.allChars.splice(index, 1);
    }
    this.removeChild(char);
    char.destroy();
    if(this.allChars.length === 0 ){
        this.parent.deleteDrop(this);
    }
}
/**
 * 
 * @param {integer} nbChara the number of charaters to the drop
 */
Drop.prototype.createDropChar = function(nbChara = 1){
    let state = State.getInstance();
    const me = this;
    for (let i = 0; i < nbChara; i++) {
        setTimeout(()=>{
            let r = Math.floor(Math.random()*200)+100;
            let c = new Char(me.cLength, (r<200)?r:null);
            c.y = i * (Char.SIZE-5);
            
            me.addChild(c);
            me.allChars.push(c);
            if(me.allChars[i-1]){
                me.allChars[i-1].color(state.currentColor);
                
            }
        },(50*i))
        
    }
}

/* ... end [Drop.js] */

/* added by combiner */

/* [State.js] ... begin */
/** pattern Singleton */
const State = (function () {
    var instance;
    /**
     * createInstance
     * @returns {object} public methods of the instance
     */
    function createInstance() {
        // definition
        this.customColor = "#dddddd";
        this.width = 800;
        this.height = 600;
        this.isMobile = Tools.isMobile();
        this.isRandom = true;
        this.isLooping = true;
        this.allQuotes = [];
        this.colors = [
            "#ed0039",
            "#44b5ff",
            "#7cfc00",
        ];
        let hashIsColor = new RegExp(/^#[a-f0-9]{6}/);
        if(hashIsColor.test(window.location.hash.toLowerCase())){
            this.customColor = window.location.hash.toLowerCase();
            this.colors.push(this.customColor);
        }
        this.currentColor = (hashIsColor.test(window.location.hash.toLowerCase())?window.location.hash.toLowerCase():"#7cfc00");
        /**
         * 
         * @param {boolean} logger [optional]
         * @returns {integer} the number of drop based on the number of columns max in the dom
         */
        function getNbDrop(logger = false){
            if(logger)console.log(this.width, (Char.SIZE/2),Math.floor(this.width/(Char.SIZE/2)))
            return Math.min(Math.floor(instance.getNbColumns()*1.5),240);
        };
        /**
         * 
         * @returns {integer}the number max of columns in the dom based on the Size of a character
         */
        function getNbColumns(){            
            return Math.floor(this.width/(Char.SIZE/2));
        };
        /**
         * 
         * @returns {integer}the number max of rows in the dom based on the Size of a character
         */
        function getNbRows(){            
            return Math.floor(this.height/(Char.SIZE));
        };
        /**
         * 
         * @returns {integer}a random Y position for a caracter or a drop
         */
        function getRandomY(){
            let nbRows = Math.floor(this.height/(Char.SIZE));
            
            return Math.floor( Math.random()*nbRows/2) * (Char.SIZE-5) ;
        };
        /**
         * 
         * @returns {object} a random quote 
         */
        function getQuote(){
            // console.log(this.allQuotes)
            let nbQuotes = this.allQuotes.length;
            let rQuote = Math.floor(Math.random()*nbQuotes);
            let quote = this.allQuotes[rQuote];
            // console.log('getQuote', nbQuotes,rQuote,quote);
            return quote;
        }
        /**
         * 
         * @returns {object} a random quote smaller than the nbColumns
         */
        function getRandomQuote(){
            function quoteLength(q){
                return (q.quote + ' ' + q.author).length;
            }
            let quote = this.getQuote();
            // console.log(this.getNbColumns());
            while(quoteLength(quote) > this.getNbColumns()){
                quote = this.getQuote();
            }

            return quote
        };
        /**
         * 
         * @param {/^#[a-f0-9]{6}/} color 
         */
        function setCurrentColor(color){
            this.currentColor = color;            
            location.hash = this.currentColor;
        }
        /**
         * 
         * @returns {hexadecimal color} change the current color and return it
         */
        function getNewColor(){
            this.currentColor =  this.colors[Math.floor(Math.random()*this.colors.length)];
            return this.currentColor;
        };
        
        // public elements
        return {
            width: this.width,
            height: this.height,
            colors: this.colors,
            isMobile: this.isMobile,
            isRandom: this.isRandom,
            isLooping: this.isLooping,
            currentColor: this.currentColor,
            customColor: this.customColor,
            allQuotes: this.allQuotes,
            getNewColor: getNewColor,
            getNbRows: getNbRows,
            getNbColumns: getNbColumns,
            getNbDrop: getNbDrop,
            getRandomY: getRandomY,
            getRandomQuote: getRandomQuote,
            getQuote: getQuote,
            setCurrentColor: setCurrentColor,
        };
    }
    
    return {
        /**
         * 
         * @returns the instance of the State object
         */
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();
/* ... end [State.js] */

/* added by combiner */

/* [Char.js] ... begin */
/**
 * Char Object
 * @param {integer} cLength the length of the cycle before delete
 * @param {integer|null} fps if not null the number between refresh character in ms
 * @param {string|null} forcedChar if not null the Character forced to display
 */
function Char(cLength, fps = null, forcedChar = null) {
  this.fps = fps;
  this.currentCount = 0;
  this.chara = forcedChar?forcedChar:this.getRandomChar();
  PIXI.extras.BitmapText.call(this, this.chara, {
    font: `${Char.SIZE}px matrix`,
    tint: "#ffffff".replace("#", "0x"),
  });
  this.cycle = 0;
  this.cycleLength = cLength;
  this.state = State.getInstance();
}
Char.prototype = Object.create(PIXI.extras.BitmapText.prototype);
// Char statics const
Char.SIZE = 20;
Char.ALL = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
  "$",
  "+",
  "-",
  "*",
  "/",
  "=",
  "%",
  '"',
  "'",
  "#",
  "&",
  "_",
  "(",
  ")",
  ",",
  ".",
  ";",
  ":",
  "?",
  "!",
  "\\",
  "|",
  "{",
  "}",
  "<",
  ">",
  "[",
  "]",
  "^",
  "~",
//   " ",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
/**
 * 
 * @returns a random Character
 */
Char.prototype.getRandomChar = function(){
    return Char.ALL[Math.floor(Math.random()*Char.ALL.length)];
}
/**
 * 
 * @param {hexadecimal color} tint set the color of the current Character
 */
Char.prototype.color = function(tint){
    this.dirty = true;
    this._font.tint = tint.replace("#", "0x");
}

/**
 * character update display
 */
Char.prototype.update = function(){    
    this.cycle ++;
    if(this.cycle >= this.cycleLength){
      this.cycle = 0
        this.parent.removeChar(this);
        return;       
      }
      
      let currentStateTint = `${this.state.currentColor}`.replace("#", "0x");
    if(this._font.tint != currentStateTint && this._font.tint != "0xffffff" ){
      this.dirty = true;
      this._font.tint = currentStateTint;
    }
    if(this.fps===null) return;
    this.currentCount ++;
    if(this.currentCount >= this.fps){
        this.currentCount = 0;
        this.dirty = true;
        this.text = this.getRandomChar();
    }
    
}
/* ... end [Char.js] */

/* added by combiner */

/* [Matrix.js] ... begin */
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
  // console.log(command);
  this.command = command
};
Matrix.prototype.deleteCommand = function (command) {
  // console.log('this.deleteCommand')
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
  // console.log(sentence);
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
   if(this.colorCount >= 500) {
    this.colorCount = 0;
    if(!this.state.isRandom){
      this.state.getNewColor();
    }
  }
  this.glitchCount++;
  if (this.glitchCount >= this.glitchTrigger) {
    this.glitchTrigger = Math.floor(Math.random() * 650) + 100;
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

/* ... end [Matrix.js] */

/* added by combiner */

/* [Main.js] ... begin */
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
  console.log("Matrix controls:  r, v, b, c, (Red, Blue, Green, Custom)");
  console.log(`use custom with ${location.origin + location.pathname}#ffa500`);

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
    this.state.setCurrentColor(this.state.colors[0]);
  };
  this.keyBlue.press = () => {
    console.log("blue pressed");
    this.matrix.addCommand('BLUE');
    this.state.setCurrentColor(this.state.colors[1]);    
  };
  this.keyGreen.press = () => {
    console.log("Green pressed");
    this.matrix.addCommand('GREEN');
    this.state.setCurrentColor(this.state.colors[2]);
  };
  this.keyCustom.press = () => {
    console.log("Custom pressed");
    this.matrix.addCommand('CUSTOM COLOR');
    this.state.setCurrentColor(this.state.customColor);
  };
  this.keyRandom.press = () => {
    console.log("Random pressed");
    this.state.isRandom = !this.state.isRandom;    
    this.matrix.addCommand(`RANDOM ${this.state.isRandom?'DEACTIVATED':'ACTIVATED'}`);
  };



  
}

// onresize reloader
function refresh() {
  location.reload();
}
// onload starting point
function init() {
  let s = State.getInstance();
  s.height = Tools.availableSize.height();
  s.width = Tools.availableSize.width();
  // console.log("init", s.width, s.height);
  loadSound();
  Tools.ajaxGet("./data/quotes.json", (data) => {
    let d = JSON.parse(data).all;
    var main = new Main(d);
  });
}
// sounds register/loader
function loadSound() {
  createjs.Sound.registerSound("./assets/drop.wav", "drop");
  createjs.Sound.registerSound("./assets/frap_1.wav", "frap_1");
  createjs.Sound.registerSound("./assets/frap_2.wav", "frap_2");
  createjs.Sound.registerSound("./assets/frap_3.wav", "frap_3");
  createjs.Sound.registerSound("./assets/frap_4.wav", "frap_4");
}


/* ... end [Main.js] */

/* added by combiner */
