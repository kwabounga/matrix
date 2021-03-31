function Char(cLength, fps = null, forcedChar = null) {
  // this.dirty = true;
  this.fps = fps;
  this.currentCount = 0;
  this.chara = forcedChar?forcedChar:this.setChar();
  PIXI.extras.BitmapText.call(this, this.chara, {
    font: `${Char.SIZE}px matrix`,
    tint: "#ffffff".replace("#", "0x"),
  });
  this.cycle = 0;
  this.cycleLength = cLength;
  this.state = State.getInstance();
}
Char.prototype = Object.create(PIXI.extras.BitmapText.prototype);

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

Char.prototype.setChar = function(){
    this.chara =  this.getRandomChar();    
      return this.chara;
}
Char.prototype.getRandomChar = function(){
    return Char.ALL[Math.floor(Math.random()*Char.ALL.length)];
}
Char.prototype.color = function(tint){
    this.dirty = true;
    // this._font.tint = "#7cfc00".replace("#", "0x");
    this._font.tint = tint.replace("#", "0x");
    
}
Char.prototype.update = function(){
    
    this.cycle ++;
    if(this.cycle >= this.cycleLength){
      this.cycle = 0
        this.parent.removeChar(this);
        return;       
      }
      
      let currentStateTint = `${this.state.currentColor}`.replace("#", "0x");
    if(this._font.tint != "0xffffff" && this._font.tint != currentStateTint){
      this.dirty = true;
      this._font.tint = currentStateTint;
    }
    if(this.fps===null) return;
    this.currentCount ++;
    if(this.currentCount >= this.fps){
        this.currentCount = 0;
        // console.log('update');
        this.dirty = true;
        this.text = this.setChar();
        
        // console.log(this);
    }
    
}