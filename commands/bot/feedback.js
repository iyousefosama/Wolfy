const discord= require('discord.js');
const TimeoutSchema = require('../../schema/TimeOut-Schema')
const moment = require('moment');
const { author } = require('../../package.json');

module.exports = {
    name: "feedback",
    aliases: ["Feedback", "FEEDBACK", "issue", "reportbug", "ReportBug", "REPORTBUG", "reportbug"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<issue>',
    group: 'bot',
    description: 'To give a feedback about bot or to report bug',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientpermissions: ["USE_EXTERNAL_EMOJIS", "ADD_REACTIONS"],
    examples: [
      'The bot ping commands not working it\'s showing undefined ping!'
    ],
    async execute(client, message, args) {

    const now = Date.now();
    const duration = Math.floor(86400000)
    let TimeOutData;
    try{
        TimeOutData = await TimeoutSchema.findOne({
            guildId: message.guild.id,
            userId: message.author.id
        })
        if(!TimeOutData) {
            TimeOutData = await TimeoutSchema.create({
                guildId: message.guild.id,
                userId: message.author.id
            })  
        }
    } catch(err) {
        console.log(err)
        message.channel.send({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`})
    }
    if (!args.length){
      client.commands.cooldowns.get(this.name).users.delete(message.author.id);
      return message.channel.send(`<a:Wrong:812104211361693696> | ${message.author}, Please add an issue to your message!`).then(()=>  message.react("💢"));
    };

    if (args.join(' ').length > 1000){
      client.commands.cooldowns.get(this.name).users.delete(message.author.id);
      return message.channel.send(`<a:Wrong:812104211361693696> | ${message.author}, Please make your report brief and short! (MAX 1000 characters!)`).then(()=>  message.react("💢"));
    };

    const owner = await client.users.fetch('724580315481243668').catch(() => null);

    if (!owner){
      return message.channel.send(`Couldn't contact \`${author}\`!`);
    };

    if (TimeOutData.feedback > now){
      const embed = new discord.EmbedBuilder()
      .setTitle(`<a:pp802:768864899543466006> Feedback already Send!`)
      .setDescription(`\\❌ **${message.author.tag}**, You already send your **feedback** earlier!\nYou can send your feedback again after \`${moment.duration(TimeOutData.feedback - now, 'milliseconds').format('H [hours,] m [minutes, and] s [seconds]')}\``)
      .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048}) })
      .setColor('Red')
      message.channel.send({ embeds: [embed] })
    } else {
      TimeOutData.feedback = Math.floor(Date.now() + duration);
      await TimeOutData.save()
      const embed = new discord.EmbedBuilder()
      .setColor('Orange')
      .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ extension:'png', dynamic: true }) })
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
    .catch(err => message.channel.send(`WOLF#1045 is currently not accepting any Feedbacks right now via DMs.`));
    }
  }
};
