const discord = require('discord.js');
const { prefix } = require('../../config.json');

module.exports = {
    name: "helpeco",
    aliases: ["HelpEco", "HELPECO", "help-eco", "helpeconomy"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    cooldown: 10, //seconds(s)
    guarded: false, //or false
    clientpermissions: ["USE_EXTERNAL_EMOJIS", "EMBED_LINKS", "ATTACH_FILES", "VIEW_CHANNEL"],
    async execute(client, message, args) {
    const Eco = new discord.MessageEmbed()
    .setColor('738ADB')
    .setTitle('<a:ShinyMoney:877975108038324224> **Economy Commands**')
    .setURL('https://Wolfy.yoyojoe.repl.co')
    .setThumbnail(client.user.displayAvatarURL())
    .addFields(
        { name: `${prefix}credits`, value: `> \`To check your credits balance in wallet\``},
        { name: `${prefix}cookie`, value: `> \`To send cookie for a friend as a gift\``},
        { name: `${prefix}beg`, value: `> \`Want to earn money some more? Why don\'t you try begging, maybe someone will give you.\``},
        { name: `${prefix}daily`, value: `> \`To get your daily reward\``},
        { name: `${prefix}fish`, value: `> \`Take your fishingpole and start fishing\``},
        { name: `${prefix}mine`, value: `> \`What you know about mining down in the deep?\``},
        { name: `${prefix}register`, value: `> \`To register a bank account\``},
        { name: `${prefix}bank`, value: `> \`To check your credits balance in wallet\``},
        { name: `${prefix}deposit`, value: `> \`Deposit credits from your wallet to safeguard\``},
        { name: `${prefix}withdraw`, value: `> \`Withdraw credits from your bank to your wallet\``},
        { name: `${prefix}inv`, value: `> \`Show your inventory items! (currently support mining only)\``},
        { name: `${prefix}sell`, value: `> \`Sell item from your inventory and get some credits!\``},
        { name: `${prefix}buy`, value: `> \`To buy items from the shop.\``},
    )
    .setFooter(client.user.username, client.user.displayAvatarURL())
    .setTimestamp()
    
    
    message.channel.send({embeds: [Eco]});
    }
}