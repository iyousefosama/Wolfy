const Discord = require('discord.js');
const schema = require('../../schema/Economy-Schema')
const moment = require("moment");
const market = require('../../assets/json/market.json');

module.exports = {
    name: "daily",
    aliases: ["Daily", "DAILY"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'Economy',
    description: 'To get your daily reward',
    cooldown: 2, //seconds(s)
    guarded: false, //or false
    permissions: [],
    examples: [''],
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
        const now = Date.now();
        const duration = Math.floor(86400000)

        if (data.timer.daily.timeout > now){
            const embed = new Discord.MessageEmbed()
            .setTitle(`<a:ShinyCoin:853495846984876063> daily already Claimed!`)
            .setDescription(`\\❌ **${message.author.tag}**, You already **claimed** your daily reward!\n\n⚠️ Your daily will reset in \`${moment.duration(data.timer.daily.timeout - now, 'milliseconds').format('H [hours,] m [minutes, and] s [seconds]')}\``)
            .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048}) })
            .setColor('RED')
            message.channel.send({ embeds: [embed] })
          } else {
        let moneyget = Math.floor(500);
        const previousStreak = data.streak.current;
        const rewardables = market.filter(x => ![1,2].includes(x.id));
        const item = rewardables[Math.floor(Math.random() * rewardables.length)];
        streakreset = false, itemreward = false;

        if ((data.streak.timestamp + 864e5) < now){
            data.streak.current = 1;
            streakreset = true;
          };

          if (!streakreset){
            data.streak.current++
            if (!(data.streak.current%10)){
              itemreward = true;
              const old = data.profile.inventory.find(x => x.id === item.id);
              if (old){
                  //Do nothing..
              } else {
                doc.data.profile.inventory.push({
                  id: item.id
                });
              };
            };
          };
    
          if (data.streak.alltime < data.streak.current){
            data.streak.alltime = data.streak.current;
          };
    
          data.streak.timestamp = now + 72e6;
          const amount = moneyget + 30 * data.streak.current;

        data.timer.daily.timeout = Date.now() + duration;
        data.credits += Math.floor(amount);
        await data.save()
        .then(() => {
            const embed = new Discord.MessageEmbed()
            .setTitle(`<a:ShinyCoin:853495846984876063> Claimed daily!`)
            .setDescription([
            `<a:ShinyMoney:877975108038324224> **${message.author.tag}**, You received **${Math.floor(amount)}** from daily reward!`,
            itemreward ? `\n\\✔️  You received: **${item.name} - ${item.description}** from daily rewards.` : '',
            streakreset ? `\n⚠️ **Streak Lost**: You haven't got your succeeding daily reward.` : `\n⚠️ Streak (\`x${data.streak.current}\`)`
        ].join(''))
            .setFooter({ text: `You can claim your daily after 24h.`, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048}) })
            .setColor('#E6CEA0')
            message.channel.send({ embeds: [embed] })
        })
        .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later! ${err}`))
    }
}
}