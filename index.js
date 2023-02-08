const {
  Client,
  Events,
  GatewayIntentBits,
  Collection,
  EmbedBuilder,
} = require('discord.js')
const fs = require('node:fs')
const path = require('node:path')
// Create a new client instance
const log = require('./util/log')
const client = new Client({ intents: [GatewayIntentBits.Guilds] })
require('dotenv').config()

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, async (c) => {
  const ch = c?.channels?.cache?.get('1065859892335886437')
  const emb = new EmbedBuilder()
    .setTitle('Refresh')
    .setDescription(`Successfully logged into ${c.user.tag}`)
    .addFields({
      name: 'Username - tag - ID',
      value: `${c.user.username} - ${c.user.tag} - ${c.user.id}`,
      inline: true,
    })
    .addFields({
      name: 'Bot process',
      value: `Platform: ${process.platform}\nNode version: ${process.version}`,
      inline: true,
    })
    .addFields({
      name: 'Login time',
      value: `${Date.now()} - ${new Date()}`,
    })
    .setColor('#32a852')
    .setTimestamp()
  ch?.send({ content: '<@716491639857872928>', embeds: [emb] })
  log('CLIENT', `Logged into ${c.user.tag}. Sob!`)
  log('CLIENT', 'Logs from commands or errors will be written below.')
  console.log('---------------------------------------')
})
// Handle commands
client.commands = new Collection()
const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith('.js'))

console.log('---------------------------------------')
console.log('Loading commands...')
console.log('Commands loaded:')
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file)
  const command = require(filePath)

  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ('data' in command && 'execute' in command) {
    console.log('/' + command.data.name)
    client.commands.set(command.data.name, command)
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
    )
  }
}
console.log('---------------------------------------')
// register cmds
require('./slash')
// Handle events
const eventsPath = path.join(__dirname, 'events')
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith('.js'))

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file)
  const event = require(filePath)
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args))
  } else {
    client.on(event.name, (...args) => event.execute(...args))
  }
}
client.login(process.env.token)

client.on('messageCreate', async (message, args) => {
  if (
    message.content.toLocaleLowerCase() === 'sob!kys' &&
    message.author.id === '716491639857872928'
  ) {
    const arg = args.join(' ')
    if (args && args >= 0 && arg) {
      await message.channel.send('Killing bot process with code ' + args)
      return process.exit(arg)
    } else {
      return message.channel.send('Please provide an exit code.')
    }
  }
})
