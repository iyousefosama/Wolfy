const Client = require(`${process.cwd()}/struct/Client`);

const config = require(`${process.cwd()}/config`);

/** Wolfy discord client instance
 * @type {import('./struct/Client')}
 */
const client = new Client(config);

client.loadCommands("/commands");
client.loadEvents("/events");
client.database?.init();

client.listentoProcessEvents([
  'unhandledRejection',
  'uncaughtException'
], { ignore: false });

client.login();