const discord= require('discord.js');
const schema = require('../../schema/Economy-Schema')

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
        const quest = data.progress.quests?.find(x => x.id == 2);
        let Box = quest?.current;
    
        var currentdate = date + time
        const nulle = new discord.EmbedBuilder()
        .setTitle(`<a:Wrong:812104211361693696> Missing item!`)
        .setDescription(`**${message.author.username}**, You can only give \`350\` cookies for free you should now buy **UltimateCookie Machine**!\nType \`${client.prefix}buy UltimateCookie\` to buy the item.`)
        .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048}) })
        .setColor('Red')
        if(!item && data.cookies.givecookies == 350) return message.channel.send({ embeds: [nulle] })
        let moneyget = Math.floor(Math.random() * 70) + 10
        data.credits += Math.floor(moneyget);
        data.cookies.givecookies++;
        FriendData.cookies.totalcookies++;
        if(quest?.current < quest?.progress) {
            Box++;
            await schema.findOneAndUpdate({ userID: message.author.id, "progress.quests.id": 2 }, { $inc: { "progress.quests.$.current": 1 } });
          }
        if(Box && Box == quest?.progress && !quest?.received) {
            data.credits += Math.floor(quest.reward);
            await schema.findOneAndUpdate({ userID: message.author.id, "progress.quests.id": 2 }, { $set: { "progress.quests.$.received": true } });
            data.progress.completed++;
            message.reply({ content: `\\✔️  You received: <a:ShinyMoney:877975108038324224> **${quest.reward}** from this command quest.`})
          }
        return Promise.all([ data.save(), FriendData.save() ])
        .then(() => {
          const embed = new discord.EmbedBuilder()
          .setTitle(`<a:Cookie:853495749370839050> Cookie is gived!`)
          .setDescription(`**${message.author.username}**, gived ${Friend} a cookie!\n<a:ShinyMoney:877975108038324224> ${message.author.username} got (\`+${moneyget}\`) credits for being a nice friend!\n\n📥 ${data.cookies.totalcookies} | 📤 ${data.cookies.givecookies}`)
          .setColor('#E6CEA0')
          message.channel.send({ embeds: [embed] })
      })
}
}