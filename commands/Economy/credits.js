const Discord = require('discord.js');
const text = require('../../util/string');
const schema = require('../../schema/Economy-Schema')

module.exports = {
    name: "credits",
    aliases: ["Credits", "CREDITS", "bal", "credit"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '<user>',
    group: 'Economy',
    description: 'To check your credits balance in wallet',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: [],
    examples: [
        '@WOLF',
        ''
      ],
    async execute(client, message, args) {

        let user = message.mentions.members.first() || message.member;

        let data;
        try{
            data = await schema.findOne({
                userID: user.id
            })
            if(!data) {
            data = await schema.create({
                userID: user.id
            })
            }
        } catch(err) {
            console.log(err)
        }
        let credits = data.credits
        const bal = new Discord.MessageEmbed()
        .setAuthor(user.user.username, user.user.displayAvatarURL({dynamic: true, size: 2048}))
        .setDescription(`<a:ShinyMoney:877975108038324224> **${user.user.username}**, credits balance is \`${text.commatize(credits)}\`!`)
        .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 2048}))
        .setTimestamp()
        message.channel.send({ embeds: [bal]} )
}
}