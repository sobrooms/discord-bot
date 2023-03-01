const c = require('cli-color')
async function log(nm, de) {
  const log = console.log;
  return log(c.red(`[${nm}]`) + " " + c.cyan(de));
}
module.exports = log;