const discord = require('discord.js');

module.exports = {
    name: "serveravatar",
    aliases: ["Serveravatar", "SERVERAVATAR", "savatar"],
    dmOnly: false, //or false
    guildOnly: true, //or false
    args: false, //or false
    usage: '',
    group: 'Informations',
    description: 'Get a server\'s avatar\.',
    cooldown: 5, //seconds(s)
    guarded: false, //or false
    permissions: [],
    clientpermissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "ATTACH_FILES"],
    examples: [''],
    async execute(client, message, args) {
    if (message.guild){
        const id = message.guild.id;
  
        guild = await client.guilds.fetch(id)
        .catch(() => null);
  
        color = '#ed7947' || '738ADB';
      } else {
          return message.channel.send({ content: `\\❌ | ${message.author}, Please make sure to use this command in the server!`})
      };


    const avatar = guild.iconURL({ dynamic: true, size: 1024 });

    let avatarserver = new discord.MessageEmbed()
    .setColor(color)
    .setAuthor(guild.name, avatar)
    .setDescription(`[**${guild.name}** avatar link](${avatar})`)
    .setURL(avatar)
    .setImage (avatar)
    .setFooter(message.author.tag + ` | \©️${new Date().getFullYear()} Wolfy`, message.author.avatarURL({dynamic: true}))
    .setTimestamp()
    message.channel.send({ embeds: [avatarserver] })
    }
}