const Client = require(`${process.cwd()}/struct/Client`);

const config = require(`${process.cwd()}/config`);

// create a new Discord client
const client = new Client(config);

client.loadEvents("/events");
client.loadCommands("/commands");

client.listentoProcessEvents([
  'unhandledRejection',
  'uncaughtException'
], { ignore: false });

["Reminder", "checkQuests", "Modules"].forEach((functions) => {
  require(`./functions/${functions}`)(client);
});


client.login(process.env.TOKEN);
