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
            "#7cfc00"
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
            console.log(this.allQuotes)
            let nbQuotes = this.allQuotes.length;
            let rQuote = Math.floor(Math.random()*nbQuotes);
            let quote = this.allQuotes[rQuote];
            console.log('getQuote', nbQuotes,rQuote,quote);
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
            console.log(this.getNbColumns());
            while(quoteLength(quote) > this.getNbColumns()){
                quote = this.getQuote();
            }

            return quote
        };
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