const Discord = require('discord.js')
const fetch = require('node-fetch');

module.exports.run = async (Client, message, args, prefix) => {
    if(!message.content.startsWith(prefix)) return;
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
                        this.Client.logger.error(err);
                        message.reply('failed!');
                    });
            }

}

    

module.exports.help = {
    name: "djs",
    aliases: ['Djs', 'discord.js search']
}