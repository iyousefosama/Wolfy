const { MessageEmbed, TextChannel } = require('discord.js');

  module.exports = {
    name: "fleave",
    aliases: ["Fleave", "FLEAVE"],
    dmOnly: false, //or false
    guildOnly: false, //or false
    args: true, //or false
    usage: '<guildID>',
    group: 'developer',
    cooldown: 60, //seconds(s)
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

  
        await guild.leave()
        .then(() => message.channel.send(`\\✔️ Sucessfully left the guild **${guild.name}**`))
        .catch(() => message.channel.send(`\\❗ Could not perform the operation.`));
  }
}
