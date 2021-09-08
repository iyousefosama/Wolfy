const Discord = require('discord.js')
const text = require(`${process.cwd()}/util/string`);
const consoleUtil = require(`${process.cwd()}/util/console`);
var currentdate = new Date();
const config = require('../config.json')
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        consoleUtil.success(`${client.user.username} is now Online! (Loaded At ${currentdate})\n\n`);

        /*======================================================
           Sends a notification to a log channel (if available)
           that the bot has rebooted
        ======================================================*/
      
        const icon = '<a:Settings:841321893750505533>'
        const servers = text.commatize(client.guilds.cache.size);
        const members = text.commatize(client.guilds.cache.reduce((a,b) => a + b.memberCount, 0));
        const commands = client.commands.size;
        const boot = currentdate;
        const message = `${icon} \`[ ${client.user.username} ]\` **REBOOT**`;
        const embed = {
          color: 'GREY',
          description: [
            '```properties',
            `Servers: ${servers}`,
            `Members: ${members}`,
            `Command: ${commands}`,
            `Boot: ${currentdate}`,
            '```'
          ].join('\n')
        };
        function randomStatus() {
            let status = ["🤖 Wolfy Bot", "🤖 w!help", "🤖 Poob Beep"]
            let rstatus = Math.floor(Math.random() * status.length);
        
            client.user.setActivity(status[rstatus], {type: "PLAYING"});
            }; setInterval(randomStatus, 5000)
            console.log(`🤖 ${client.user.username} is Online!`)
      const botname = client.user.username;
      const logchannel = await client.channels.cache.get(config.debug)
      const webhooks = await logchannel.fetchWebhooks();
      const webhook = webhooks.first();
      if(webhook) {
        await webhook.send({
          embeds: [embed],
          username: botname,
          avatarURL: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })
        });
      } else if(!webhook) {
        await client.channels.cache.get(config.debug)?.createWebhook(botname, {
          avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })
        })
        .then(webhook => Promise.all([webhook.send({ embeds: [embed] }), webhook]))
      }
      
        // add more functions on ready  event callback function...
      
        return;
    }
}