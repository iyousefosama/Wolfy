const Discord = require('discord.js')
const { MessageEmbed, WebhookClient } = require('discord.js');

module.exports = {
    name: 'ready',
    async execute(client) {
        const checkReminders = async () => {
            const { MessageActionRow, MessageButton, WebhookClient } = require('discord.js');
            const webhookClient = new WebhookClient({ id: "898353711540232192", token: "HTB21V519CAPZLzInEbYkxgs4JxbjChtyN_7j4Bqqj7cLSkQOCWqWBUeAJijRL85udiP" });
            if(!webhookClient) return;
            const embed = new Discord.MessageEmbed()
            .setAuthor(client.user.username, client.user.displayAvatarURL())
            .setTimestamp()
            .setThumbnail(client.user.displayAvatarURL())
            .setImage(`https://cdn.discordapp.com/attachments/830926767728492565/874773027177512960/c7d26cb2902f21277d32ad03e7a21139.gif`)
            .setTitle(`${client.user.username} Reminder!`)
            .setDescription(`<a:Cookie:853495749370839050> **Hey, Server members** that's all my special links!\n\n\`\`\`You can support our bot with voting it on top.gg & inviting it\`\`\`[**Support server**](https://discord.gg/qYjus2rujb)\n[**Add bot!**](https://discord.com/api/oauth2/authorize?client_id=821655420410003497&permissions=8&scope=bot%20applications.commands)\n[**Vote here!**](https://top.gg/bot/821655420410003497)\n[**Bot Website!**](https://wolfy.yoyojoe.repl.co/)`)
            .setURL(`https://wolfy.yoyojoe.repl.co/`)
            
            webhookClient.send({
                username: 'Wolfy',
                avatarURL: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 }),
                embeds: [embed],
            })
        .catch(() => {});
        setTimeout(checkReminders, 10000 * 60)
        }
        checkReminders()
    }
}
