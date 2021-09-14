const Discord = require('discord.js');
const schema = require('../../schema/Economy-Schema')
const moment = require("moment");

module.exports = {
    name: "daily",
    aliases: ["Daily", "DAILY"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    cooldown: 2, //seconds(s)
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
        const now = Date.now();
        const duration = Math.floor(86400000)
        if (data.timer.daily.timeout > now){
            const embed = new Discord.MessageEmbed()
            .setTitle(`<a:ShinyCoin:853495846984876063> daily already Claimed!`)
            .setDescription(`\\❌ **${message.author.tag}**, You already **claimed** your daily reward!\nYour daily will reset in \`${moment.duration(data.timer.daily.timeout - now, 'milliseconds').format('H [hours,] m [minutes, and] s [seconds]')}\``)
            .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true, size: 2048}))
            .setColor('RED')
            message.channel.send({ embeds: [embed] })
          };

        let moneyget = Math.floor(Math.random() * 300) + 200;

        data.timer.daily.timeout = Date.now() + duration;
        data.credits += Math.floor(moneyget);
        await data.save()
        .then(() => {
            const embed = new Discord.MessageEmbed()
            .setTitle(`<a:ShinyCoin:853495846984876063> Claimed daily!`)
            .setDescription(`> <a:ShinyMoney:877975108038324224> **${message.author.tag}**, You received **${moneyget}** from daily reward!`)
            .setFooter(`You can claim your daily after 24h.`, message.author.displayAvatarURL({dynamic: true, size: 2048}))
            .setColor('#E6CEA0')
            message.channel.send({ embeds: [embed] })
        })
        .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`))
}
}