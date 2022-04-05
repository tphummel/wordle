const crypto = require('crypto')

const before = require('./solutions-nyt.json')
const after = require('./solutions-nyt-2022-04-03.json')

console.log(`
before: ${before.length}
after: ${after.length}
`)

for (let i=0; i < after.length; i++) {
  let beforeSha = crypto.createHash('sha1')
  beforeSha.update(before[i+1])

  let afterSha = crypto.createHash('sha1')
  afterSha.update(after[i])

  console.log(`${i} ${beforeSha.digest('hex')===afterSha.digest('hex')}`)
}
