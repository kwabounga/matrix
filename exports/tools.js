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
    console.log(isMob)
    return isMob;
  }
  