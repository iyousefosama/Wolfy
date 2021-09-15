const { MessageEmbed, TextChannel } = require('discord.js');
const config = require('../../config.json')

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

      const embed = new MessageEmbed()
      .setColor('RED')
      .setTitle(`Wolfy requested by **${message.author.tag}**, to leave **${guild.name}** server!`)
      .setDescription(`Reason:\n${reason.join(' ') || 'Unspecified'}`)
      const Debug = await client.channels.cache.get(config.debug)
      const botname = client.user.username;
      setTimeout(async function(){
        const webhooks = await Debug.fetchWebhooks()
        let webhook = webhooks.filter((w)=>w.type === "Incoming" && w.token).first();
        if(!webhook){
          webhook = await Debug.createWebhook(botname, {avatar: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 })})
        }
        webhook.send({embeds: [embed]})
        .catch(() => {});
      }, 5000)
    .then(() => guild.leave())
    .then(() => message.channel.send(`\\✔️ Sucessfully left the guild **${guild.name}**`))
    .catch(() => message.channel.send(`\\❗ Could not perform the operation.`));
  }
}
