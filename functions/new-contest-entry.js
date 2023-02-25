export async function onRequest(context) {
  const formData = await context.request.formData()
  const name = formData.get('name')
  const result = formData.get('result')
  const wordList = formData.get('word_list')
  const comments = formData.get('comments')
  
  const data = { name, result, wordList, comments }
  const jsonData = JSON.stringify(data)

  console.log(jsonData)

  const currentDatePacific = (new Date()).toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles'
  }).toISOString().slice(0,7)
  
  const response = await context.env.WORDLE_CONTEST_ENTRIES.put({
    name: `${currentDatePacific}/${name}.json`,
    data: jsonData,
    contentType: 'application/json'
  })

  return new Response(`contest entry received!`)
}