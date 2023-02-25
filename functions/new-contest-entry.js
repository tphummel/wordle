export async function onRequest(context) {
  if (context.request.method !== 'POST') {
    return new Response('This endpoint only accepts POST requests', { status: 405 })
  }

  const formData = await context.request.formData()
  const name = formData.get('name')
  const result = formData.get('result')
  const wordList = formData.get('word_list')
  const comments = formData.get('comments')
  
  const data = { name, result, wordList, comments }
  const jsonData = JSON.stringify(data)

  console.log(jsonData)

  const today = new Date()
  const pacificTime = today.toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles'
  })
  const todayPacific = new Date(pacificTime).toISOString().slice(0,10)
  
  const response = await context.env.WORDLE_CONTEST_ENTRIES.put(`${todayPacific}/${name}.json`, jsonData)

  return new Response(`contest entry received!`)
}