const Client = require(`${process.cwd()}/struct/Client`);

const config = require(`${process.cwd()}/config`);

// create a new Discord client
const client = new Client(config);

client.loadEvents("/events");
client.loadCommands("/commands");
client.database?.init();

client.listentoProcessEvents([
  'unhandledRejection',
  'uncaughtException'
], { ignore: false });

client.login();