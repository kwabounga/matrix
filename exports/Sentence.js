/**
 * Sentence Object
 * @param {string} text the text to display (quote + author)
 * @param {integer} limitQuote the position of the quote's end
 */
function Sentence (text, limitQuote) {
    PIXI.Sprite.call(this);
    this.allChars = [];
    let f = new PIXI.filters.NoiseFilter();
        f.blendMode = PIXI.BLEND_MODES.ADD;
        f.noise = 0.59;
        f.seed = 0.33;
        f.autoFit = true;
        this.filters = [f];
    this.limitQuote = limitQuote;
    this.createSentence(text.toUpperCase())
}
Sentence.prototype = Object.create(PIXI.Sprite.prototype);

/**
 * 
 * @param {string} text the text to display
 * @param {integer} nbDropLeft the number of drops still present on the screen
 */
Sentence.prototype.createSentence = function(text, nbDropLeft = 5){
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
    this.allChars.forEach((char)=>{
        char.update();
    })
}

/**
 * 
 * @param {Char} char the character to delete
 */
Sentence.prototype.removeChar = function(char){
    var index = this.allChars.indexOf(char);
    if (index > -1) {
        this.allChars.splice(index, 1);
    }
    this.removeChild(char);
    char.destroy();
    if(this.allChars.length === 0 ){
        this.parent.deleteSentence(this);
    }
}