const path = require("path");
const fs = require("fs");
const npm = require("../../package.json");

// check for bin directory existence : create or clean it
const bin = path.join(__dirname, npm.combiner.output);
deleteBinDir(bin)
.then(()=>{
  if (!fs.existsSync(bin)) {
    console.log(`${bin} recreation ...`);
    fs.mkdirSync(bin);
    console.log("... done");
  }
  console.log(`${bin} is clean`);
  
})
.catch((error)=>{console.error(error.message)})
.finally(()=>{
  console.log('... done');
  process.exit(0);
})






async function deleteBinDir(bin) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(bin)){
      console.log(`${bin} exist, clean it up ...`);

      try{
        fs.rm(bin, {recursive: true, force: true}, ()=>{
          console.log('... done');
          resolve();
        })
      } catch(e){
        reject(e)
      }
    } else{
      console.log(`${bin} is clean`);
      resolve();
    }
    
    
  })
}