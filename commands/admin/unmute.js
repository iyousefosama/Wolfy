const discord = require('discord.js');
const schema = require('../../schema/Mute-Schema')

module.exports = {
    name: "unmute",
    aliases: ["Unmute", "UNMUTE"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: true, //or false
    usage: '<user>',
    group: 'Moderation',
    description: 'Unmute someone from texting!',
    cooldown: 2, //seconds(s)
    guarded: false, //or false
    permissions: ["MANAGE_ROLES"],
    clientpermissions: ["MANAGE_ROLES"],
    examples: [
        '@BADGUY',
        '742682490216644619'
      ],
    async execute(client, message, [member = '', ...args]) {

    const owner = await message.guild.fetchOwner()
    const author = message.author

    if (!member.match(/\d{17,19}/)){
        return message.channel.send(`\\❌ | ${message.author}, Please type the id or mention the user to mute.`);
      };
  
      member = await message.guild.members
      .fetch(member.match(/\d{17,19}/)[0])
      .catch(() => null);

      let data;
      try{
          data = await schema.findOne({
              guildId: message.guild.id,
              userId: member.id
          })
          if(!data) {
              data = await schema.create({
                  guildId: message.guild.id,
                  userId: member.id
              })  
          }
      } catch(err) {
          console.log(err)
          message.channel.send({ content: `\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`})
      }

    if (!member) return message.channel.send(`\\❌ | ${message.author}, User could not be found! Please ensure the supplied ID is valid.`);
    if (member.id === client.user.id) return message.channel.send(`\\❌ | ${message.author}, You can't Unmute me!`);
    if (member.id === message.author.id) return message.channel.send(`\\❌ | ${message.author}, You can't Unmute yourself!`);
    if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(`\\❌ | ${message.author}, User could not be Unmuted!`);
    if (member.roles.cache.find(r => r.name.toLowerCase() != 'muted' && data?.Muted != true)) return message.channel.send(`\\❌ | ${message.author}, User is already Unmuted!`);

    let mutedRole = message.guild.roles.cache.find(roles => roles.name === "Muted")
    
    if(!mutedRole) {
        return message.reply({ content: "<a:pp681:774089750373597185> | I can't find a \`muted\` role in this server, please create one!"}).then(()=>  message.react("💢")).catch(() => null)
    } else {
    member.roles.remove(mutedRole, `Wolfy UNMUTE: ${message.author.tag}`).catch(() => message.reply({ content: '💢 | I can\'t remove \`mutedRole\` to the user, please check that my role is higher!'}))
    data.Muted = false
    await data.save()
    .then(() => {
    const unmute = new discord.MessageEmbed()
    .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({dynamic: true, size: 2048}) })
    .setDescription(`<:On:841711383284547625> Unmuted the user ${member}!`)
    .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: true, size: 2048}) })
    .setTimestamp()
    message.channel.send({ embeds: [unmute] })
    })
    .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`))
    }
}
}