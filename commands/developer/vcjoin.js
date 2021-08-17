const discord = require('discord.js');

module.exports = {
  name: "fun",
  aliases: ["Fun", "FUN"],
  dmOnly: false, //or false
  guildOnly: true, //or false
  args: false, //or false
  usage: '',
  cooldown: 5, //seconds(s)
  guarded: false, //or false
  clientpermissions: ["USE_EXTERNAL_EMOJIS", "EMBED_LINKS", "VIEW_CHANNEL", "CONNECT"],
  async execute(client, message, args) {
    if (message.channel.type === "dm") return;
    if(message.author.id !== '829819269806030879') return;

          if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            var  loading = new discord.MessageEmbed()
            .setColor(`GREEN`)
            .setDescription(`<a:Right:812104211386728498> I joined the vc!`)
            var msg = message.channel.send(loading)
          } else {
            message.reply('You must be in voicechannel');
          }
        }
}