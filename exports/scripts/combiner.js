console.log("// COMBINER // \n");
const path = require("path");
const npm = require("../../package.json");
const data = npm.combiner;
const fs = require("fs");
let fullFile = "";

/**
 * Code Previewer
 * @param {String} txt full code
 * @param {int} size size in chara for the preview
 * @returns {String} the previewed code > "some code [...] end of code"
 */
const prev = function (txt, size = 300) {
  let s = txt.length;
  return (
    txt.slice(0, Math.floor(size / 2)) +
    "...\n[...]\n..." +
    txt.slice(s - Math.floor(size / 2), s - 1)
  );
};
/**
 * Comment Header construction based on package.json infos
 * @returns {String} the Global Comment Header
 */
const formatInfos = function () {
  let i = `
  /**
   * ${npm.title.toUpperCase()}
   * 
   * @author ${npm.author} 
   * @description ${npm.description} 
   * @version ${npm.version} 
   * @see ${npm.homepage} 
   * @last_update ${(new Date()).toUTCString()}
   * ${npm.license} 
   * 
   */
  
  `;
  return i;
};
// add Header
fullFile += formatInfos();

// load all sources
console.log("// LOADING SOURCE FILES:");
data.files.forEach((file) => {
  // get the current file url
  let fileUrl = path.join(__dirname, file);
  let fParts = file.split("/");
  let fileName = fParts[fParts.length - 1];
  console.log(fileUrl);
  fullFile += `\n/* [${fileName}] ... begin */\n`;
  // get the content of the file
  let s = fs.readFileSync(fileUrl, { encoding: "utf-8" });
  // add the content to the fullCode
  fullFile += s;
  fullFile += `\n/* ... end [${fileName}] */\n`;
  fullFile += "\n/* added by combiner */\n";
});
// show preview in console
console.log("\nDATA PREV");
console.log(prev(fullFile));

// construction of the path and name of the combined js file
const binDir = path.join(__dirname, "../../public/bin/");
let nfp = path.join(binDir, `${data.name}.js`);

// create the destination folder if no exist
if (!fs.existsSync(binDir)) {
  console.log(`${binDir} not exist create it ...`);
  fs.mkdirSync(binDir);
  console.log("... done");
}
// saving the combined file
console.log("save source in the new file ...");
fs.writeFile(nfp, fullFile, () => {
  console.log("... done\n");
  console.log("your file is saved to ", nfp);
});
