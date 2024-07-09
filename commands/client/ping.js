const discord = require('discord.js');

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "ping",
    aliases: ["PING", "Ping"],
    dmOnly: false, //or false
    guildOnly: false, //or false
    args: false, //or false
    usage: '',
    group: 'bot',
    description: 'Shows the bot ping',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientPermissions: [discord.PermissionsBitField.Flags.UseExternalEmojis],
    examples: [''],
    async execute(client, message, args) {
        const loading = new discord.EmbedBuilder()
            .setColor('Gold')
            .setDescription(`<a:Loading_Color:759734580122484757> Finding bot ping...`)
        await message.channel.send({ embeds: [loading] }).then(msg => {
            const ping = msg.createdTimestamp - message.createdTimestamp;
            let Pong = new discord.EmbedBuilder()
                .setColor('#ffff66')
                .setDescription(`Pong!`)
            msg.edit({ embeds: [Pong] })
            let Ping = new discord.EmbedBuilder()
                .setColor('DarkGreen')
                .setDescription(`<a:pp224:853495450111967253> The Ping of the bot is \`${ping}ms\`!\n\`🤖\` API Latency is \`${Math.round(client.ws.ping)}ms\`!`)
            msg.edit({ embeds: [Ping] })
        })
    }
}