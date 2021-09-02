const discord = require('discord.js');
const moment = require('moment');

module.exports = {
    name: "feedback",
    aliases: ["Feedback", "FEEDBACK", "issue", "reportbug", "ReportBug", "REPORTBUG", "reportbug"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<issue>',
    cooldown: 360, //seconds(s)
    guarded: false, //or false
    clientpermissions: ["USE_EXTERNAL_EMOJIS", "ADD_REACTIONS"],
    async execute(client, message, args) {

    if (!args.length){
      client.commands.cooldowns.get(this.name).users.delete(message.author.id);
      return message.channel.send(`<a:Wrong:812104211361693696> | ${message.author}, Please add an issue to your message!`).then(()=>  message.react("💢"));
    };

    if (args.join(' ').length > 1000){
      client.commands.cooldowns.get(this.name).users.delete(message.author.id);
      return message.channel.send(`<a:Wrong:812104211361693696> | ${message.author}, Please make your report brief and short! (MAX 1000 characters!)`).then(()=>  message.react("💢"));
    };

    const owner = await client.users.fetch('829819269806030879').catch(() => null);

    if (!owner){
      return message.channel.send(`Couldn't contact ᒍoe#0001!`);
    };

    
      const embed = new discord.MessageEmbed()
      .setColor('ORANGE')
      .setAuthor(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
      .setTitle('Re: Feedback/Report')
      .setDescription([
        moment(new Date()).format('dddd, do MMMM YYYY'),
        `${message.guild.name}\u2000|\u2000#${message.channel.name}`,
        `Guild ID: ${message.guild.id}\u2000|\u2000Channel ID: ${message.channel.id}\u2000|\u2000User ID:${message.author.id}`,
        '\n',
        args.join(' ')
      ].filter(Boolean).join('\n'))
      .addFields({
        name: 'Please use the template below to reply',
        value: [
          '```js',
          '// REPLY TO USER',
          `w!eval message.client.users.fetch('${message.author.id}').then(u => {`,
          `  u.send(\`YOUR MESSAGE HERE\`)`,
          `})`,
          '\n',
          '// REPLY TO CHANNEL',
          `w!eval message.client.channels.cache.get('${message.channel.id}').send(\`YOUR MESSAGE HERE\`)`,
          '```'
        ].join('\n')
      })
    owner.send({ embeds: [embed] }).then(() => message.react('758141943833690202')).catch(() => message.channel.send('<:Verify:841711383191879690> Feedback Sent!'))
    .catch(err => message.channel.send(`ᒍoe#0001 is currently not accepting any Feedbacks right now via DMs. You might to join my support server instead or make an issue on my github repo to directly address your issue.`));
  }
};
