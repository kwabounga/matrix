/** pattern Singleton */
const State = (function () {
    var instance;
 
    function createInstance() {
        // definition
        this.width = 800;
        this.height = 600;
        this.isMobile = Tools.isMobile();
        this.isLooping = true;
        this.allQuotes = [];
       // console.log(window.location.hash);
        this.colors = [
            "#ed0039",
            "#1e00f7",
            "#7cfc00"
        ];
        let regEx = new RegExp(/^#[a-f0-9]{6}/)
        if(regEx.test(window.location.hash)){
            this.colors.push(window.location.hash);
        }
        this.currentColor = (regEx.test(window.location.hash)?window.location.hash:"#7cfc00");
        
        function getNbDrop(logger = false){
            if(logger)console.log(this.width, (Char.SIZE/2),Math.floor(this.width/(Char.SIZE/2)))
            return Math.min(Math.floor(instance.getNbColumns()*1.5),240);
        };
        function getNbColumns(){            
            return Math.floor(this.width/(Char.SIZE/2));
        };
        function getNbRows(){            
            return Math.floor(this.height/(Char.SIZE));
        };
        function getRandomY(){
            let nbRows = Math.floor(this.height/(Char.SIZE));
            
            return Math.floor( Math.random()*nbRows/2) * (Char.SIZE-5) ;
        };
        function getQuote(){
            console.log(this.allQuotes)
            let nbQuotes = this.allQuotes.length;
            let rQuote = Math.floor(Math.random()*nbQuotes);
            let quote = this.allQuotes[rQuote];
            console.log('getQuote', nbQuotes,rQuote,quote);
            return quote;
        }
        function getRandomQuote(){
            function quoteLength(q){
                return (q.quote + ' ' + q.author).length;
            }
            let quote = this.getQuote();
            console.log(this.getNbColumns());
            while(quoteLength(quote) > this.getNbColumns()){
                quote = this.getQuote();
            }

            return quote
        };
        function getNewColor(){
            this.currentColor =  this.colors[Math.floor(Math.random()*this.colors.length)];
            return this.currentColor;
        };
        //console.log(Object.getOwnPropertyNames(this))
        // object returned
        return {
            width: this.width,
            height: this.height,
            colors: this.colors,
            isMobile: this.isMobile,
            isLooping: this.isLooping,
            currentColor: this.currentColor,
            allQuotes: this.allQuotes,
            getNewColor: getNewColor,
            getNbRows: getNbRows,
            getNbColumns: getNbColumns,
            getNbDrop: getNbDrop,
            getRandomY: getRandomY,
            getRandomQuote: getRandomQuote,
            getQuote: getQuote,
        };
    }
 
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();