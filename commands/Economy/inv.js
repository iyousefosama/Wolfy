const Discord = require('discord.js');
const schema = require('../../schema/Economy-Schema')

module.exports = {
    name: "inv",
    aliases: ["Inv", "inventory", "Inventory", "INVENTORY"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    async execute(client, message, args) {

        let data;
        try{
            data = await schema.findOne({
                userID: message.author.id
            })
            if(!data) {
            data = await schema.create({
                userID: message.author.id
            })
            }
        } catch(err) {
            console.log(err)
        }
        const inv = new Discord.MessageEmbed()
        .setAuthor(client.user.username, client.user.displayAvatarURL({dynamic: true, size: 2048}))
        .setColor('#2F3136')
        .setTitle(`<a:BackPag:776670895371714570> ${message.author.username} Inventory!`)
        .setDescription(`\`\`\`This is a very early version for economy the current inv is for mining items only!\`\`\`\n`)
        .addFields(
            { name: '<:e_:887034070842900552> Coal', value: `\`\`\`${data.inv.Coal}\`\`\``},
            { name: '<:e_:887031111790764092> Stone', value: `\`\`\`${data.inv.Stone}\`\`\``},
            { name: '<:e_:887034687472689192> Iron', value: `\`\`\`${data.inv.Iron}\`\`\``},
            { name: '<:e_:887036608874967121> Gold', value: `\`\`\`${data.inv.Gold}\`\`\``},
            { name: '<a:Diamond:877975082868301824> Diamond', value: `\`\`\`${data.inv.Diamond}\`\`\``},
        )
        .setURL('https://Wolfy.yoyojoe.repl.co')
        .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 2048}))
        .setTimestamp()
        message.channel.send({ embeds: [inv]} )
}
}