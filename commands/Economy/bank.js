const Discord = require('discord.js');
const schema = require('../../schema/Economy-Schema')
const moment = require("moment");
const text = require('../../util/string');
const { prefix } = require('../../config.json');

module.exports = {
    name: "bank",
    aliases: ["Bank", "BANK"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'Economy',
    description: 'To check your credits balance in bank',
    cooldown: 5, //seconds(s)
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
        let credits = data.Bank.balance.credits
        let moneyadd = Math.floor(credits * 1.05) + 150;

        if (!data || data.Bank.balance.credits === null || data.Bank.info.Enabled == false){
            return message.channel.send(`\\❌ **${message.author.tag}**, You don't have a *bank* yet! To create one, type \`${prefix}register\`.`);
        }
        
        const now = Date.now();
        const duration = Math.floor(86400000)
        if (data.timer.banktime.timeout > now){
            const embed = new Discord.MessageEmbed()
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048}) })
            .setColor('GREY')
            .setDescription(`🏦 **${message.author.username}**, you have <a:ShinyMoney:877975108038324224> **${text.commatize(credits)}** credits in your bank account!\n\n⚠️ Check your bank after \`${moment.duration(data.timer.banktime.timeout - now, 'milliseconds').format('H [hours,] m [minutes, and] s [seconds]')}\` to get your reward! **(5% + 150)**`)
            .setTimestamp()
            message.channel.send({ embeds: [embed] })
          } else if(data.Bank.balance.credits + moneyadd > 100000) {
            return message.channel.send(`\\❌ **${message.author.tag}**, Your bank is overflowed please withdraw some money from your bank.`);
          } else {
            data.timer.banktime.timeout = Date.now() + duration;
            data.Bank.balance.credits = Math.floor(moneyadd)
            await data.save()
            .then(() => {
            const checkembed = new Discord.MessageEmbed()
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048}) })
            .setColor('DARK_GREEN')
            .setDescription(`🏦 **${message.author.username}**, Your new balance is <a:ShinyMoney:877975108038324224> **${text.commatize(moneyadd)}** credits in your bank account!\n\n⚠️ Check your bank again after \`${moment.duration(data.timer.banktime.timeout - now, 'milliseconds').format('H [hours,] m [minutes, and] s [seconds]')}\` to get your next reward! **(5% + 150)**`)
            .setTimestamp()
            message.channel.send({ embeds: [checkembed] })
            })
            .catch(err => message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: \`${err.name}\``))
    }
}
}