const Client = require(`${process.cwd()}/struct/Client`);

const config = require(`${process.cwd()}/config`);

// create a new Discord client 
const client = new Client(config);

const express = require('express')
const app = express()
const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)

client.listentoProcessEvents([
  'unhandledRejection',
  'uncaughtException'
], { ignore: false });


["SlashHandler", "CommandHandler", "EventHandler"].forEach((handler) => {
  require(`./Handler/${handler}`)(client);
});

["Reminder", "checkQuests", "Modules"].forEach((functions) => {
  require(`./functions/${functions}`)(client);
});


client.login(process.env.TOKEN);
