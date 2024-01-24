const Client = require(`${process.cwd()}/struct/Client`);

const config = require(`${process.cwd()}/config`);

// create a new Discord client 
const client = new Client(config);

const express = require('express');
const server = express();

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
 
server.all('/', (req, res) => {
  res.send(`OK`)
})
 
function keepAlive() {
  server.listen(3000, () => { console.log("Alive") });
}

client.login(process.env.TOKEN);
