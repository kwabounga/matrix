function Drop () {
    PIXI.Sprite.call(this);
    this.allChars = [];
    this.size = Math.max((Math.floor(Math.random()*25)+10),Math.floor(Math.random()*60))
    this.cLength = (Math.random() * 300)+50;
    
    this.createRain(this.size);
    // console.log(this);
    // console.log(Tools.rb())
    this.state = State.getInstance();
    // console.log(this.state.isMobile);
    if(Tools.rb(5)){
        
        // BG
        let f = new PIXI.filters.BlurFilter(Tools.random(20),3,3);
        f.blendMode = PIXI.BLEND_MODES.HARD_LIGHT;
        f.autoFit = true;
        this.filters = [f];

        
    } else {
        // FG
        let f = new PIXI.filters.NoiseFilter();
        f.blendMode = PIXI.BLEND_MODES.ADD;
        f.noise = 0.59;
        f.seed = 0.33;
        f.autoFit = true;
        this.filters = [f];
    }
}

Drop.prototype = Object.create(PIXI.Sprite.prototype);
Drop.prototype.update = function(){
    this.allChars.forEach((char)=>{
        char.update();
    })
}
Drop.prototype.getSize = function(){
        return this.size;
}
Drop.prototype.forceDelete = function(){
    const me = this;
    for (let i = 0; i < me.allChars.length; i++) {
        const char = me.allChars[i]
        setTimeout(()=>{
            char.cycleLength = 0;
            },(Tools.randomBetween(0,20)*i))
            
        
    }
}
Drop.prototype.removeChar = function(char){
    
    // console.log('removeChar', char);
    var index = this.allChars.indexOf(char);
    if (index > -1) {
        this.allChars.splice(index, 1);
    }
    this.removeChild(char);
    char.destroy();
    if(this.allChars.length === 0 ){
        // console.log('Drop Empty')
        this.parent.deleteDrop(this);
    }
}
Drop.prototype.createRain = function(nbChara = 1){
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
