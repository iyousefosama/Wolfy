const { MessageEmbed, TextChannel } = require('discord.js');

  module.exports = {
    name: "fleave",
    aliases: ["Fleave", "FLEAVE"],
    dmOnly: false, //or false
    guildOnly: false, //or false
    args: true, //or false
    usage: '<guildID>',
    cooldown: 260, //seconds(s)
    guarded: false, //or false
    OwnerOnly: true,
    clientpermissions: ["EMBED_LINKS", "ATTACH_FILES"],
    async execute(client, message, [id = '', ...reason]) {

    if (!id.match(/\d{17,19}/)){
      return message.channel.send(`\\❌| ${message.author}, Please provide the ID of the server you want me to leave from.`);
    };

    const guild = client.guilds.cache.get(id);

    if (!guild){
      return message.channel.send(`\\❌ | ${message.author}, guild **${id}** does not exist on your cache`)
    };

    return guild.channels.cache.filter(c =>
      c instanceof TextChannel &&
      c.permissionsFor(client.user.me)
      .has([ 'VIEW_CHANNEL','SEND_MESSAGES' ]
    )).send(
      new MessageEmbed()
      .setColor('RED')
      .setTitle(`👋 My developer has requested that I leave ${guild.name}!`)
      .setDescription(`Reason:\n${reason.join(' ') || 'Unspecified'}`)
    ).then(() => guild.leave())
    .then(() => message.channel.send(`\\✔️ Sucessfully left the guild **${guild.name}**`))
    .catch(() => message.channel.send(`\\❗ Could not perform the operation.`));
  }
}
