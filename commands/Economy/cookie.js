const Discord = require('discord.js');
const schema = require('../../schema/Economy-Schema')
const { prefix } = require('../../config.json');

module.exports = {
    name: "cookie",
    aliases: ["Cookie", "COKKIE"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<user>',
    cooldown: 6, //seconds(s)
    guarded: false, //or false
    async execute(client, message, args) {

        let Friend = message.mentions.members.first()
        if(!Friend) {
            return;
        } else if(Friend.id == message.author.id) {
            return message.channel.send(`\\❌ **${message.author.tag}**, You can't give yourself a cookie!`);
        }
        

        let data;
        let FriendData;
        try{
            data = await schema.findOne({
                userID: message.author.id
            })
            FriendData = await schema.findOne({
                userID: Friend.id
            })
            if(!data) {
            data = await schema.create({
                userID: message.author.id
            })
            } else if(!FriendData) {
            FriendData = await schema.create({
                userID: Friend.id
            })
            }
        } catch(err) {
            console.log(err)
        }
        const nulle = new Discord.MessageEmbed()
        .setTitle(`<a:Wrong:812104211361693696> Missing item!`)
        .setDescription(`**${message.author.username}**, You can only give \`250\` cookies for free you should now buy **UltimateCookie Machine**!\nType \`${prefix}buy UltimateCookie\` to buy the item.`)
        .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true, size: 2048}))
        .setColor('RED')
        if(data.cookies.givecookies == 250 && data.inv.UltimateCookie !== 1) return message.channel.send({ embeds: [nulle] })
        let moneyget = Math.floor(Math.random() * 40) * 3
        data.credits += Math.floor(moneyget);
        data.cookies.givecookies += Math.floor('1');
        FriendData.cookies += Math.floor('1');
        await data.save()
        .then(() => {
          const embed = new Discord.MessageEmbed()
          .setTitle(`<a:Cookie:853495749370839050> Cookie is gived!`)
          .setDescription(`**${message.author.username}**, gived ${Friend} a cookie!\n<a:ShinyMoney:877975108038324224> ${message.author.username} got (\`+${moneyget}\`) credits for being a nice friend!`)
          .setFooter(`<a:Up:853495519455215627> ${data.cookies.totalcookies} | <a:Down:853495989796470815> ${data.cookies.givecookies}`, message.author.displayAvatarURL({dynamic: true, size: 2048}))
          .setColor('#E6CEA0')
          message.channel.send({ embeds: [embed] })
      })
}
}