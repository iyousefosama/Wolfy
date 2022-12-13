const Discord = require('discord.js')
const fetch = require('node-fetch');

module.exports = {
    name: "djs",
    aliases: ["Djs", "Discord.js", "discord.js"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<query>',
    group: 'Search',
    description: 'Searching for anthing in djs library',
    cooldown: 2, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientpermissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS"],
    examples: [
        'embeds'
      ],
    async execute(client, message, args) {

        let query = args.join(" ");
                // Input Checking
                if (!query[0]) { message.channel.send({ content: '<:Discordjs:805086222749007874> **Please specify what do you want to search in the Discord.JS library!**'}) } else {
    
    
                    // Executing
                    const url = `https://djsdocs.sorta.moe/v2/embed?src=stable&q=${query}`;
                    fetch(url)
                        .then(res => res.json())
                        .then(embed => {
                            if (embed && !embed.error) {
                                message.channel.send({ embeds: [embed] });
                            } else {
                                message.reply({ content: `<a:Wrong:812104211361693696> | Failed to find anything using the specified query in DiscordJS library. Please try again.`});
                            }
                        })
                        .catch(err => {
                            message.reply({ content: '<a:Wrong:812104211361693696> | Failed to find anything using the specified query in DiscordJS library. Please try again.'})
                        });
                }
    }
}