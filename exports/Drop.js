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
    this.allChars.forEach((char)=>{
        char.update();
    })
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
    for (let i = 0; i < me.allChars.length; i++) {
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
            let r = Math.floor(Math.random()*200);
            let c = new Char(me.cLength, (r<100)?r:null);
            c.y = i * (Char.SIZE-5);
            
            me.addChild(c);
            me.allChars.push(c);
            if(me.allChars[i-1]){
                me.allChars[i-1].color(state.currentColor);
                
            }
        },(50*i))
        
    }
}
