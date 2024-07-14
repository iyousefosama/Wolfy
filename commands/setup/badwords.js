const discord = require('discord.js');
const schema = require('../../schema/GuildSchema')
const text = require('../../util/string');

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "badwords",
    aliases: [],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '(<add> | <remove>) <word>',
    group: 'setup',
    description: 'Add/remove/show blacklisted words for the current guild.',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    requiresDatabase: true,
    permissions: ["Administrator"],
    clientPermissions: ["ManageMessages"],
    examples: [
    'bad'
    ],
    
    async execute(client, message, [type = '', ...args]) {
          
        let word = args[0]

        let data;
        try{
            data = await schema.findOne({
                GuildID: message.guild.id
            })
            if(!data) {
                data = await schema.create({
                    GuildID: message.guild.id
                })
            }
        } catch(err) {
            console.log(err)
            message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`)
        }
        if(type.toLowerCase() == 'add') {
            const WordToBeAdded = word.toLowerCase()
            if(!WordToBeAdded) return message.channel.send(`\\❌ **${message.member.displayName}**, Please add the word to blacklist!`)
            if(data.Mod.BadWordsFilter.BDW.includes(WordToBeAdded)) return message.channel.send(`\\❌ **${message.member.displayName}**, This word is already blacklisted!`)
            if(data.Mod.BadWordsFilter.BDW.length > 400) return message.channel.send(`\\❌ **${message.member.displayName}**, Maximum number of blacklisted words is (400)!`)
            if (word.length < 2 || word.length > 35){
                return message.reply({ content: `<a:Wrong:812104211361693696> | ${message.author}, The word must be greater than two (2) and less than (35)`});
              };
            data.Mod.BadWordsFilter.BDW.push(WordToBeAdded)
            await data.save()
            .then(() => {
                const added = new discord.EmbedBuilder()
                .setColor('738ADB')
                .setDescription([
                  '<a:pp989:853496185443319809>\u2000|\u2000',
                  `Successfully added the word \`${word}\`!\n\n`,
                  !data.Mod.BadWordsFilter.isEnabled ? `\\⚠️ BadWords filter is disabled! To enable, type \`${client.prefix}badwordstoggle\`\n` :
                  `To disable this feature, use the \`${client.prefix}badwordstoggle\` command.`
                ].join(''))
                .setTimestamp()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048})})
                message.channel.send({ embeds: [added] })
              }).catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
        }
        if(type.toLowerCase() == 'remove') {
            const WordToBeRemoved = word.toLowerCase()
            if(!WordToBeRemoved) return message.channel.send(`\\❌ **${message.member.displayName}**, Please add the word to remove!`)
            if(!data.Mod.BadWordsFilter.BDW.includes(WordToBeRemoved)) return message.channel.send(`\\❌ **${message.member.displayName}**, This word is not from blacklisted words!`)
            let array = data.Mod.BadWordsFilter.BDW;
            array = array.filter(x => x !== WordToBeRemoved)
            data.Mod.BadWordsFilter.BDW = array
            await data.save()
            .then(() => {
                const removed = new discord.EmbedBuilder()
                .setColor('738ADB')
                .setDescription([
                  '<a:pp989:853496185443319809>\u2000|\u2000',
                  `Successfully removed the word \`${word}\`!\n\n`,
                  !data.Mod.BadWordsFilter.isEnabled ? `\\⚠️ BadWords filter is disabled! To enable, type \`${client.prefix}badwordstoggle\`\n` :
                  `To disable this feature, use the \`${client.prefix}badwordstoggle\` command.`
                ].join(''))
                .setTimestamp()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048})})
                message.channel.send({ embeds: [removed] })
              }).catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
        } else if(type.toLowerCase() !== 'remove' && type.toLowerCase() !== 'add') {
            if(!data || data.Mod.BadWordsFilter.BDW == null || data.Mod.BadWordsFilter.BDW.length == 0) return message.channel.send(`\\❌ **${message.member.displayName}**, There is no blacklisted words in this server!`)
            const BadWordsEmbed = new discord.EmbedBuilder()
            .setColor('738ADB')
            .setDescription([
              'Current blacklisted words from this server:\n',
              `Total **(${data.Mod.BadWordsFilter.BDW.length})**: \`\`\`${text.joinArray(data.Mod.BadWordsFilter.BDW)}\`\`\`\n\n`,
              !data.Mod.BadWordsFilter.isEnabled ? `\\⚠️ BadWords filter is disabled! To enable, type \`${client.prefix}badwordstoggle\`\n` :
              `To disable this feature, use the \`${client.prefix}badwordstoggle\` command.`
            ].join(''))
            .setTimestamp()
            .setFooter({ text: `${client.prefix}badwords add (to add) | ${client.prefix}badwords remove (to remove)`})
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048})})
            return message.channel.send({ embeds: [BadWordsEmbed]})
        }
}
}