const discord = require('discord.js');
const { MessageActionRow, MessageButton, EmbedBuilder } = require('discord.js');
const { QueryType } = require("discord-player")

/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
  name: "volume",
  aliases: ["Volume", "VOLUME"],
  dmOnly: false, //or false
  guildOnly: true, //or false
  args: true, //or false
  usage: '<quantity>',
  group: 'Music',
  description: 'Set the volume for the current queue',
  cooldown: 3, //seconds(s)
  guarded: false, //or false
  permissions: [],
  clientPermissions: ["Connect", "Speak"],
  examples: [
      '70'
    ],
    
  async execute(client, message, [vol]) {
        const queue = client.player.getQueue(message.guildId)

        if (!message.member.voice.channel){
            return await message.reply("<:Success:888264105851490355> Sorry, you need to join a voice channel first to play a song!");
          } else if (message.guild.members.me.voice.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId){
            return await message.reply("<:Success:888264105851490355>You are not in my voice channel!");
          } else if (!client.player.getQueue(message.guild.id)){
            return await message.reply("<:Success:888264105851490355> There are no songs in the queue!");
          };

        if (!vol) return message.channel.send(`❌ ${message.author}, Please add the volume, current volume is \`${queue.volume}\`!`)
        if (vol < 0 || vol > 100) return message.channel.send({ content: `❌ ${message.author}, Volume range must be \`1-100\`!` });

        queue.setVolume(vol).then(async success => {
          return await message.reply({ content: success ? `**Successfully** set the volume to \`${vol}%\`!` : '<:error:888264104081522698> Something went wrong!'})
      }).catch(() => message.channel.send(`\`❌ [Queue_ERR]:\` Unable to play or add the current track, please try again later!`));;
}
}