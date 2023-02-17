const discord = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const uuid = require('uuid');
const warnSchema = require('../../schema/Warning-Schema')

module.exports = {
    name: "warn",
    aliases: ["Warn", "WARN"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<user> (reason)',
    description: 'Warn a user in the server!',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: [discord.PermissionsBitField.Flags.Administrator],
    examples: [
      '@BadGuy Spamming in chat!',
      '742682490216644619 Dm Ad!'
      ],
    async execute(client, message, [user = '', ...args]) {
        let reason = args.slice(0).join(" ")
        const owner = await message.guild.fetchOwner()

        if (!user.match(/\d{17,19}/)){
            return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, Please mention the user or provide the id to warn.`});
          };
      
          user = await message.guild.members
          .fetch(user.match(/\d{17,19}/)[0])
          .catch(() => null);
      
          if (!user){
            return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, User could not be found!`});
          };

          if (!reason){
            return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, Please provide a warn reason!`});
          };
      
          if (user.id === message.guild.ownerId){
            return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, You cannot warn a server owner!`});
          };
      
          member = await message.guild.members
          .fetch(user.id)
          .catch(() => false);
      
          if (user.id === message.author.id){
            return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, You cannot warn yourself!`});
          };
      
          if (user.id === client.user.id){
            return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, You cannot warn me!`});
          };

          const warnObj = {
            authorId: message.author.id,
            timestamp: Math.floor(Date.now() / 1000),
            warnId: uuid.v4(),
            reason: reason,
        };

        const warnAddData = await warnSchema.findOneAndUpdate(
            {
                guildId: message.guild.id,
                userId: user.id,
            },
            {
                guildId: message.guild.id,
                userId: user.id,
                $push: {
                    warnings: warnObj,
                },
            },
            {
                upsert: true,
            },
        );
        const warnCount = warnAddData ? warnAddData.warnings.length + 1 : 1;
        const warnGrammar = warnCount === 1 ? '' : 's';
        if(warnCount >= 20) return message.channel.send({ content: `<a:Wrong:812104211361693696> | ${message.author}, Maximum warnings number is \`20\`!` })
        const warnEmbed = new EmbedBuilder()
        .setAuthor({ name: user.user.tag, iconURL: user.user.displayAvatarURL({dynamic: true, size: 2048}) })
        .setColor('#e6a54a')
        .setTitle(`⚠️ Warned **${user.user.username}**`)
        .setDescription(`• **Warn Reason:** ${reason}\n• **Warning${warnGrammar} Count:** ${warnCount}\n• **Warned By:** ${message.author.tag}`)
        .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048}) })
        message.channel.send({ embeds: [warnEmbed] })
        const dmembed = new EmbedBuilder()
        .setAuthor({ name: user.user.tag, iconURL: user.user.displayAvatarURL({dynamic: true, size: 2048}) })
        .setColor('#e6a54a')
        .setTitle(`⚠️ Warned **${user.user.username}**`)
        .setDescription(`• **Warn Reason:** ${reason}\n• **Warning${warnGrammar} Count:** ${warnCount}\n• **Warned By:** ${message.author.tag}`)
        .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048}) })
        try {
            await user.send({ embeds: [dmembed] })
        } catch(error) {
            return;
        }
}
}