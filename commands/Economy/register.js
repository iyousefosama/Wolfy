const discord = require('discord.js');
const schema = require('../../schema/Economy-Schema')

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "register",
    aliases: ["Register", "REGISTER"],
    dmOnly: false, //or false
    guildOnly: false, //or false
    args: false, //or false
    usage: '',
    group: 'Economy',
    description: 'To register a bank account',
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
        let credits = data.credits
        if(data.Bank.info.Enabled == true) {
          message.channel.send({ content: `\\❌ **${message.author.tag}**, You already registered a bank accounnt!`})
        } else if(credits < 8000) {
          message.channel.send({ content: `\\❌ **${message.author.tag}**, You didn't get **8,000** yet to create a bank account!`})
        } else {
            data.credits -= Math.floor(8000);
            data.Bank.balance.credits =  Math.floor(Math.random() * 250) + 250;
            data.Bank.info.Enabled = true
            await data.save()
            .then(()=> message.channel.send(`\\✔️ **${message.author.tag}**, Successfully created **🏦 Bank account** You received **${data.Bank.balance.credits}** as a gift!\n *Bank cost* <a:ShinyMoney:877975108038324224> \`-5,000\``))
            .catch(err => message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: \`${err.name}\``));
        }
}
}