const discord = require('discord.js');
const text = require('../../util/string');
const schema = require('../../schema/Economy-Schema')

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "credits",
    aliases: ["bal", "credit"],
    dmOnly: false, //or false
    guildOnly: false, //or false
    args: false, //or false
    usage: '<user>',
    group: 'Economy',
    description: 'To check your credits balance in wallet',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    requiresDatabase: true,
    permissions: [],
    examples: [
        '@WOLF',
        ''
      ],
     execute: async (client, message, [user = '']) => {
      if (message.guild){
        const id = (user.match(/\d{17,19}/)||[])[0] || message.author.id;
  
        member = await message.guild.members.fetch(id)
        .catch(() => message.member);
  
        user = member.user;
      } else {
        user = message.author;
      };

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
            message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`)
        }
        const now = Date.now();
        let credits = data.credits
        let bank = data.Bank.balance.credits
        const dailyUsed = data.timer.daily.timeout !== 0 && data.timer.daily.timeout - Date.now() > 0;
        const bal = new discord.EmbedBuilder()
        .setAuthor({ name: `${user.username}'s wallet`, iconURL: user.displayAvatarURL({dynamic: true, size: 2048}) })
        .setColor('Grey')
        .setDescription(`<a:ShinyMoney:877975108038324224> Credits balance is \`${text.commatize(credits)}\`!\n${data.Bank.balance.credits !== null
            ? `🏦 Bank balance is \`${text.commatize(bank)}\`!`
            : `\\❌ **${user.tag}**, Don't have a *bank* yet! To create one, type \`${prefix}register\`.`
          }\n\n━━━━━━━━━━━━━━\n${
            dailyUsed ? '<:Success:888264105851490355> Daily reward is **claimed**!' : `\\⚠️ Daily reward is **avaliable**!`
          }`)
        .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048}) })
        .setTimestamp()
        message.channel.send({ embeds: [bal]} )
}
}