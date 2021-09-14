const Discord = require('discord.js');
const schema = require('../../schema/Economy-Schema')
const { prefix } = require('../../config.json');

module.exports = {
    name: "bank",
    aliases: ["Bank", "BANK"],
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
        if (!data || data.Bank.balance.credits === null || data.Bank.info.Enabled == false){
            return message.channel.send(`\\❌ **${message.author.tag}**, You don't have a *bank* yet! To create one, type \`${prefix}register\`.`);
        }
        let credits = data.Bank.balance.credits
            message.channel.send(`🏦 **${message.author.username}**, you have <a:ShinyMoney:877975108038324224> **${credits}** credits in your bank account!`)
            .catch(err => message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: \`${err.name}\``));
}
}