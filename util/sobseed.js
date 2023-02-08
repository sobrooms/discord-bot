const lts = "v2.1.1";
const versions = [
  "v1.0",
  "v2.0",
  "v2.1",
  "v2.1.1"
]
const getVer = {
  details: require('./so.json').desc || 'failed to get desc',
  changes: require('./so.json').changes || 'failed to get changes',
  download: require('./so.json').download || 'https://failed.to.fetch.details',
}
module.exports = {
  lts,
  getVer,
  versions,
}
