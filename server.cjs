const fastify = require('fastify')({ logger: true })

fastify.options('/stats', (req, res) => {
  res
    .headers({
      Allow: 'OPTIONS, GET',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'content-type',
    })
    .status(200)
    .send()
})

fastify.get('/stats', (req, res) => {
  const totalItems = Math.round(Math.random() * 100 + 1000)
  const items = [
    'Mac Book Pro',
    'LG TV',
    'Samsung Galaxy S20',
    'Apple Watch',
    'Google Home',
  ]
  const lastSoldItem = items[Math.floor(Math.random() * items.length)]
  const response = { totalItems, lastSoldItem }
  console.dir(response)
  res
    .headers({
      'access-control-allow-origin': '*',
      'access-control-request-headers': 'Content-Type',
    })
    .send(response)
})

const start = async () => {
  try {
    await fastify.listen({ port: 4200 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()

async function closeServer(signal) {
  console.log(`closing the server with the signal ${signal}`)
  await fastify.close()
  process.kill(process.pid, signal)
}
process.once('SIGINT', closeServer)
process.once('SIGTERM', closeServer)
