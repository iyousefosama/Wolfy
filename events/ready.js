const Discord = require('discord.js')
const text = require(`${process.cwd()}/util/string`);
const consoleUtil = require(`${process.cwd()}/util/console`);
var currentdate = new Date();
const config = require('../config.json')
const { version } = require('./../package.json');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        consoleUtil.success(`${client.user.username} is now Online! (Loaded At ${currentdate})\n\n`);

        /*======================================================
           Sends a notification to a log channel (if available)
           that the bot has rebooted
        ======================================================*/

        const bot = client.user.username;
        const icon = '<a:Settings:841321893750505533>'
        const servers = text.commatize(client.guilds.cache.size);
        const members = text.commatize(client.guilds.cache.reduce((a,b) => a + b.memberCount, 0));
        const commands = client.commands.size;
        const boot = currentdate;
        const SlashCommands = client.slashCommands.size;
        const message = `${icon} \`[ ${version} ]\` **REBOOT**`;
        const embed = {
          color: 'GREY',
          description: [
            '```properties',
            `Servers: ${servers}`,
            `Members: ${members}`,
            `Command: ${commands}`,
            `SlashCommands: ${SlashCommands}`,
            `Boot: ${boot}`,
            '```'
          ].join('\n')
        };
        function randomStatus() {
            let status = ["🤖 Wolfy Bot", "🤖 w!help", "🤖 Poob Beep", `📥 Server Count: ${servers}!`]
            let rstatus = Math.floor(Math.random() * status.length);

            
        
            client.user.setPresence({ activities: [{ name: status[rstatus], type: "PLAYING" }], status: 'online' });
            }; setInterval(randomStatus, 10000)
            console.log(`🤖 ${client.user.username} is Online!`)
      
            if(!config.debug || !config.debug2) {
              return;
            } else {
              // Do nothing..
            }
            const Debug = await client.channels.cache.get(config.debug)
            const botname = client.user.username;
            setTimeout(async function(){
            const webhooks = await Debug.fetchWebhooks()
            let webhook = webhooks.filter((w)=>w.type === "Incoming" && w.token).first();
            if(!webhook){
              webhook = await Debug.createWebhook(botname, {avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })})
            } else if(webhooks.size <= 10) {
              // Do no thing...
            }
            webhook.send({ content: message, embeds: [embed] })
            .catch(() => {});
          }, 5000);
          const Debug2 = await client.channels.cache.get(config.debug2)
          setTimeout(async function(){
          const webhooks = await Debug2.fetchWebhooks()
          let webhook = webhooks.filter((w)=>w.type === "Incoming" && w.token).first();
          if(!webhook){
            webhook = await Debug2.createWebhook(botname, {avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })})
          } else if(webhooks.size <= 10) {
            // Do no thing...
          }
          webhook.send({ content: message, embeds: [embed] })
          .catch(() => {});
        }, 7000);
      
        // add more functions on ready  event callback function...
      
        return;
    }
}
