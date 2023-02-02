const discord= require('discord.js');
const { EmbedBuilder } = require('discord.js');
const schema = require('../../schema/GuildSchema')

module.exports = {
    name: "respond",
    aliases: ["Respond", "RESPOND"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '[Message ID] (accept/deny) (Optional: reason)',
    description: 'Respond to a user suggestion in the server.',
    cooldown: 3, //seconds(s)
    guarded: false, //or false
    group: 'Moderation',
    permissions: [discord.PermissionsBitField.Flags.Administrator],
    examples: [
    '854382039524048956 accept very good suggestion',
    '854382039524048956 deny Sorry your suggestion is refused'
    ], 
    async execute(client, message, [id, action = '', ...reason]) {
        let data;
        try{
            data = await schema.findOne({
                GuildID: message.guild.id
            })
            if(!data) return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I can't find the suggestions channel please contact mod or use \`w!setSuggch\` cmd.`})
        } catch(err) {
            console.log(err)
            message.channel.send({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`})
        }

        const channelID = data.Mod.Suggestion.channel;
        
        
            if (!channelID){
              return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I can't find the suggestions channel please contact mod or use \`w!setSuggch\` cmd.`});
            };
        
            const channel = message.guild.channels.cache.get(channelID);
        
            if (!channelID){
                return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I can't find the suggestions channel please contact mod or use \`w!setSuggch\` cmd.`});
            };
        
            if (!id){
                return message.channel.send({ content: `\\❌ **${message.member.displayName}**, Please add the suggestion id!`});
            };
        
            if (!['accept', 'deny'].includes(action.toLowerCase())){
            return message.channel.send({ content: `\\❌ **${message.member.displayName}**, Please specify if you want to \`accept\` or \`deny\` the suggestion!`});
            };
        
            if (!reason.length || reason.join(' ').length > 1024){
              return message.channel.send({ content: `\\❌ **${message.member.displayName}**, Reason shouldn't be more than (\`1024 caracters\`)`});
            };
        
            const suggestion = await channel.messages.fetch(id).catch(() => undefined);
        
            if (!suggestion ||
              suggestion.author.id !== client.user.id ||
              !suggestion.embeds.length ||
              !(suggestion.embeds[0].title || '').endsWith('Suggestion')
            ){
            return message.channel.send({ content: `\\❌ **${message.member.displayName}**, Suggestion message can not be found!`});
            };
        
            if (suggestion.embeds[0].fields.length > 1){
             return message.channel.send({ content: `\\❌ **${message.member.displayName}**, Suggestion already responded!`});
            };
        
            if (!suggestion.editable){
             return message.channel.send({ content: `\\❌ **${message.member.displayName}**, I can't edit this suggestion message!`});
            };
        
            suggestion.embeds[0].fields[0].value = action.toLowerCase() === 'accept'
            ? `Accepted by **${message.author.tag}**`
            : `Denied by **${message.author.tag}**`;
        
            return suggestion.edit({ embeds:
              [new EmbedBuilder(suggestion.embeds[0])
              .setColor(action.toLowerCase() === 'accept' ? 'DARK_GREEN' : 'RED')
              .addFields({ name: 'Reason', value: reason.join(' ')})]
            }).then(()=> message.react('888264104026992670'))
            .catch(()=> message.reply(`\\❌ **${message.member.displayName}**, Suggestion can\'t be edited.`));
}
}