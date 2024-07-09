const discord = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const schema = require('../../schema/GuildSchema')

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
    name: "setleavermsg",
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '<msg/embed> <text>',
    group: 'setup',
    description: 'Set the leaver msg or embed',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: ["Administrator"],
    examples: [
      'msg {tag} has just leaved {guildName} server!',
      'embed Member leaved, Member: {tag} JoinedAt: {joinedAt} MembersCount: {memberCount}'
    ],
    
    async execute(client, message, [stats = '', ...args]) {

      let text = args.slice(0).join(" ")

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
            message.channel.send({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`})
        }

    stats = stats.toLowerCase();
      if (stats === 'msg') {
        if(!text) return message.channel.send(`\\❌ | **${message.author.tag}**, You didn't add the leaver **message**!`)
              data.greeter.leaving.type = 'msg';
              data.greeter.leaving.message = `${text}`;
              await data.save()
              const msgembed = new EmbedBuilder()
              .setColor('Green')
              .setDescription([
                '<a:Correct:812104211386728498>\u2000|\u2000',
                `Leaver message has been Successfully set!\n\n`,
                `To set it back to default \`${client.prefix}setleavermsg default\`\n`,
                `To test the leaver message\`${client.prefix}setleavermsg test\``,
              ].join(' '))
              message.channel.send({ embeds: [msgembed] })
            .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
      } else if(stats === 'embed') {
        if(!text) return message.channel.send(`\\❌ | **${message.author.tag}**, You didn't add the leaver **Embed Description**!`)
              data.greeter.leaving.type = 'embed';
              data.greeter.leaving.embed = `${text}`;
              await data.save()
              const embedmsg = new EmbedBuilder()
              .setColor('Green')
              .setDescription([
                '<a:Correct:812104211386728498>\u2000|\u2000',
                `Leaver embed has been Successfully set!\n\n`,
                `To set it back to default \`${client.prefix}setleavermsg default\`\n`,
                `To test the leaver message\`${client.prefix}setleavermsg test\``,
              ].join(' '))
              message.channel.send({ embeds: [embedmsg] })
            .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
      } else if(stats === 'default') {
        data.greeter.leaving.type = 'default';
        await data.save()
        message.channel.send(`\\✔️ **${message.author.tag}**, Successfully set leaver msg to **default**.`)
      .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
        message.channel.send({ content: `set the new message to: ${text}`})
      } else if (stats === 'test') {
        message.react('758141943833690202').catch(() => message.channel.send('<:Verify:841711383191879690> Successfully send the test welcome msg!'))
        return client.emit('guildMemberRemove', message.member);
      } else {
        return message.channel.send({ content: `\\❌ | **${message.author.tag}**, \`[${stats}]\` is not a valid option!`});
    };
  }
};

function sendError(message){
  return message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`)
};
