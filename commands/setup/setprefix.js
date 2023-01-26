const discord= require('discord.js');
const schema = require('../../schema/GuildSchema')

module.exports = {
    name: "setprefix",
    aliases: ["SetPrefix", "SETPREFIX", "prefix"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '<prefix>',
    group: 'setup',
    description: 'Set the bot prefix to another one!',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: [discord.PermissionsBitField.Flags.Administartor],
    examples: [
      '!',
      'l!'
    ],
    async execute(client, message, [prefix]) {
      
      if (!prefix){
        return message.channel.send(`\\❌ **${message.author.tag}**, No new prefix detected! Please type the new prefix.`);
      } else if (prefix.length > 5){
        return message.channel.send(`\\❌ **${message.author.tag}**, Invalid prefix. Prefixes cannot be longer than 5 characters!`);
      } else {
          
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

        data.prefix = [prefix, null][Number(!!prefix.match(/clear|reset/i))];
        await data.save()
        .then(() => {
          return message.channel.send([
            `\\✔️ **${message.author.tag}**, Successfully`,
            [
              'removed this server\'s prefix!\nTo add prefix, simply pass the desired prefix as parameter.',
              `set this server's prefix to \`${data.prefix}\`!\nTo remove the prefix, just pass in \`reset\` or \`clear\` as parameter.`
            ][Number(!!data.prefix)]
          ].join(' '));
        }).catch(()=> message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
    }
}
}