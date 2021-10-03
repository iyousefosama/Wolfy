const Discord = require('discord.js');
const schema = require('../../schema/Economy-Schema')
const market = require('../../assets/json/market.json');
const { prefix } = require('../../config.json');

module.exports = {
    name: "cookie",
    aliases: ["Cookie", "COKKIE"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<user>',
    group: 'Economy',
    description: 'To send cookie for a friend as a gift',
    cooldown: 6, //seconds(s)
    guarded: false, //or false
    permissions: [],
    examples: [
        '@WOLF'
      ],
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
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes();
        const item = data.profile.inventory.find(x => x.id == 2);
    
        var currentdate = date + time
        const nulle = new Discord.MessageEmbed()
        .setTitle(`<a:Wrong:812104211361693696> Missing item!`)
        .setDescription(`**${message.author.username}**, You can only give \`350\` cookies for free you should now buy **UltimateCookie Machine**!\nType \`${prefix}buy UltimateCookie\` to buy the item.`)
        .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true, size: 2048}))
        .setColor('RED')
        if(!item && data.cookies.givecookies == 350) return message.channel.send({ embeds: [nulle] })
        let moneyget = Math.floor(Math.random() * 40) + 10
        data.credits += Math.floor(moneyget);
        data.cookies.givecookies += Math.floor('1');
        FriendData.cookies.totalcookies += Math.floor('1');
        await data.save()
        await FriendData.save()
        .then(() => {
          const embed = new Discord.MessageEmbed()
          .setTitle(`<a:Cookie:853495749370839050> Cookie is gived!`)
          .setDescription(`**${message.author.username}**, gived ${Friend} a cookie!\n<a:ShinyMoney:877975108038324224> ${message.author.username} got (\`+${moneyget}\`) credits for being a nice friend!\n\n📥 ${data.cookies.totalcookies} | 📤 ${data.cookies.givecookies}`)
          .setColor('#E6CEA0')
          message.channel.send({ embeds: [embed] })
      })
}
}