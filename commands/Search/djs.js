const Discord = require('discord.js')
const fetch = require('node-fetch');

module.exports = {
    name: "djs",
    aliases: ["Djs", "Discord.js", "discord.js"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<query>',
    cooldown: 2, //seconds(s)
    guarded: false, //or false
    clientpermissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS"],
    async execute(client, message, args) {

        const msg = message;
        let query = args.join(" ");
                // Input Checking
                if (!query[0]) { message.channel.send('<:Discordjs:805086222749007874> **Please specify what do you want to search in the Discord.JS library!**') } else {
    
    
                    // Executing
                    const url = `https://djsdocs.sorta.moe/v2/embed?src=stable&q=${query}`;
                    fetch(url)
                        .then(res => res.json())
                        .then(embed => {
                            if (embed && !embed.error) {
                                message.channel.send({ embed });
                            } else {
                                message.reply(`failed to find anything using the specified query in DiscordJS library. Please try again.`);
                            }
                        })
                        .catch(err => {
                            message.reply('failed!')
                        });
                }
    }
}