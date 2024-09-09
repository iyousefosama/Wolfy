const text = require(`${process.cwd()}/util/string`);
const consoleUtil = require(`${process.cwd()}/util/console`);
const { EmbedBuilder, ActivityType, Client } = require('discord.js')
const { version } = require('./../package.json');
const ManagerCheck = require("../util/functions/ManagerCheck")
const Reminder = require("../util/functions/Reminder")
const checkQuests = require("../util/functions/checkQuests")

const BEV = require("../util/types/baseEvents");

/** @type {BEV.BaseEvent<"ready">} */
module.exports = {
  name: 'ready',
  once: true,
  /**
  * @param {import('../struct/Client')} client
  */
  async execute(client) {
    await new Promise(r => setTimeout(r, 3500))
    consoleUtil.Success(`🤖 ${client.user.username} is now Online! (Loaded in ${client.bootTime} ms)`);
    client.expressServer();
    setInterval(() => Reminder(client), 1000 * 60 * 1);
    setInterval(() => checkQuests(client), 1000 * 60 * 2);
    ManagerCheck(client)

    /*======================================================
       Sends a notification to a log channel (if available)
       that the bot has rebooted
    ======================================================*/

    const icon = '<a:Settings:841321893750505533>'
    const servers = text.commatize(client.guilds.cache.size);
    const members = text.commatize(client.guilds.cache.reduce((a, b) => a + b.memberCount, 0));
    const commands = client.commands?.size;
    const boot = client.bootTime;
    const SlashCommands = client.application.commands?.cache.size;
    const message = `${icon} \`[ ${version} ]\` **REBOOT**`;

    const embed = new EmbedBuilder()
      .setColor('Grey')
      .setDescription([
        '```properties',
        `Servers: ${servers}`,
        `Members: ${members}`,
        `Command: ${commands}`,
        `SlashCommands: ${SlashCommands}`,
        `Boot: ${boot}`,
        '```'
      ].join('\n'))

    function randomStatus() {
      let status = ["🤖 Wolfy Bot", "🤖 /help - w!help", "🤖 Poob Beep"]
      let rstatus = Math.floor(Math.random() * status.length);

      client.user.setPresence({ activities: [{ name: status[rstatus], type: ActivityType.Playing }], status: 'online' });
    }; setInterval(randomStatus, 10000)

    if (!client.config.channels.debug) {
      return;
    } else {
      // Do nothing..
    }
    const Debug = await client.channels.cache.get(client.config.channels.debug) || await client.channels.cache.get("877130715337220136");
    const botname = client.user.username;
    setTimeout(async function () {
      const webhooks = await Debug?.fetchWebhooks()
      let webhook = webhooks?.filter((w) =>/*w.type === "Incoming" &&*/ w.token).first();
      if (!webhook) {
        webhook = await Debug?.createWebhook({ name: botname, avatar: client.user.displayAvatarURL({ extension: 'png', dynamic: true, size: 128 }) })
      } else if (webhooks.size <= 10) {
        // Do no thing...
      }
      webhook?.send({ content: message, embeds: [embed] })
        .catch(() => { });
    }, 5000);

    // add more functions on ready  event callback function...

    return;
  }
}
