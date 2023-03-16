const c = require('cli-color')
const fs = require('fs')

async function log(sender, content, doNotLogInLogFile = true, logInLogFile = false, doNotLogInConsole = false) {
  const cl = console.log;
  if (!doNotLogInConsole) {
    cl(c.red(`[${sender}]`) + " " + c.cyan(content));
  }
  let fscontent = `[By ${sender} at ${new Date()}]: "${content}"`
  if (!doNotLogInLogFile && logInLogFile) {
    if (!fs.existsSync('./app.log', function(){})) {
      fs.writeFile("./app.log", fscontent, function(err){if(err){console.error(err)}});
    } else if (fs.existsSync('./app.log', function(){})) {
      let curContent = fs.readFileSync("./app.log", 'utf8', (err) => {
      if (err) {
        console.error(err);
      }})
      let fscontentsec = `${curContent}\n${fscontent}`
      fs.writeFileSync("./app.log", fscontentsec)
    }
  }
}
module.exports = log;