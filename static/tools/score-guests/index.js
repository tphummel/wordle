const fs = require('fs')
const path = require('path')
const csv = require('csv-parser')
const analyzeEmoji = require(path.join(__dirname, '../enhance/enrich-emoji.js'))

// TODO: load my puzzle file to get the starter and solution words. remove those from the guest word lists if they have been included.

const filename = process.argv[2]

const players = []
fs.createReadStream(filename)
  .pipe(csv({ 
    separator: '\t',
    headers: ['ts', 'name', 'result', 'words']
  }))
  .on('data', (data) => players.push(data))
  .on('end', () => {
    const enhancedPlayers = players.map((player, i) => {
      let enhanced
      try {
        enhanced = analyzeEmoji(player.result)
      } catch(e) {
        console.log(`Error parsing emoji for ${player.name} ${player.result} ${e}`)
      }

      const lowercaseName = player.name.toLowerCase()

      return Object.assign(enhanced, {
        playerName: lowercaseName,
        timestamp: player.ts,
        rawShare: player.result,
        words: player.words
          .split(/[\s\,]/)
          .filter(w => w.length === 5)
          .map(w => w.toLowerCase())
      })
    }).sort((a, b) => {
      if (a.puzzleScore > b.puzzleScore) return 1
      if (a.puzzleScore < b.puzzleScore) return -1
      return 0
    })

    enhancedPlayers.forEach((player) => {
      fs.writeFileSync(`./${player.playerName}.json`, JSON.stringify(player, null, 2))
    })

    enhancedPlayers.forEach((p) => {
      console.log(`${p.playerName}: ${p.puzzleScore} Points`)
    })

    enhancedPlayers.forEach((p) => {
      console.log(`
Name: ${p.playerName}
Score: ${p.puzzleScore}
Words: ${p.words.join(', ')}
${p.rawShare}
----
`)
    })
  })