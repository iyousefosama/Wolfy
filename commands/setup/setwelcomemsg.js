const { MessageEmbed } = require('discord.js');
const schema = require('../../schema/GuildSchema')
const parser = require('../../util/greeter/parser');
const errors = require('../../util/greeter/errors');
const success = require('../../util/greeter/success');
const { prefix } = require('../../config.json');

module.exports = {
    name: "setwelcomemsg",
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '<msg/embed> <text>',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: ["ADMINISTRATOR"],
    clientpermissions: ["ADMINISTRATOR"],
    async execute(client, message, [stats = '', ...args]) {

      let text = args.slice(1).join(" ")

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
        if(!text) return message.channel.send(`\\❌ | **${message.author.tag}**, You didn't add the welcome **message**!`)
              data.greeter.welcome.type = 'msg';
              data.greeter.welcome.message = `${text}`;
              await data.save()
              const msgembed = new MessageEmbed()
              .setColor('GREEN')
              .setDescription([
                '<a:Correct:812104211386728498>\u2000|\u2000',
                `Welcomer message has been Successfully **${state}**!\n\n`,
                `To set it back to default \`${prefix}setwelcomemsg default\`\n`,
                `To test the welcome message\`${prefix}setwelcomemsg test\``,
              ].join(' '))
              message.channel.send({ embeds: [msgembed] })
            .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
      } else if(stats === 'embed') {
        if(!text) return message.channel.send(`\\❌ | **${message.author.tag}**, You didn't add the welcome **Embed Description**!`)
              data.greeter.welcome.type = 'embed';
              data.greeter.welcome.embed = `${text}`;
              await data.save()
              const embedmsg = new MessageEmbed()
              .setColor('GREEN')
              .setDescription([
                '<a:Correct:812104211386728498>\u2000|\u2000',
                `Welcomer embed has been Successfully **${state}**!\n\n`,
                `To set it back to default \`${prefix}setwelcomemsg default\`\n`,
                `To test the welcome message\`${prefix}setwelcomemsg test\``,
              ].join(' '))
              message.channel.send({ embeds: [embedmsg] })
            .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
      } else if(stats === 'default') {
        data.greeter.welcome.type = 'default';
        await data.save()
        message.channel.send(`\\✔️ **${message.author.tag}**, Successfully set welcome msg to **default**.`)
      .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
        message.channel.send({ content: `set the new message to: ${text}`})
      } else if (stats === 'test') {
        message.react('758141943833690202').catch(() => message.channel.send('<:Verify:841711383191879690> Successfully send the test welcome msg!'))
        return client.emit('guildMemberAdd', message.member);
      } else {
        return message.channel.send({ content: `\\❌ | **${message.author.tag}**, \`[${stats}]\` is not a valid option!`});
    };
  }
};

function sendError(message){
  return message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`)
};
