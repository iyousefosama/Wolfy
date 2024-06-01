const discord = require('discord.js');
const { MessageActionRow, MessageButton, EmbedBuilder } = require('discord.js');
const { QueryType } = require("discord-player")
const playdl = require("play-dl");

module.exports = {
  name: "skipto",
  aliases: ["SkipTo", "SKIPTO"],
  dmOnly: false, //or false
  guildOnly: true, //or false
  args: false, //or false
  usage: '<tracknumber>',
  group: 'Music',
  description: 'Skips the current track to a certain track',
  cooldown: 3, //seconds(s)
  guarded: false, //or false
  permissions: [],
  clientPermissions: [discord.PermissionsBitField.Flags.Connect, discord.PermissionsBitField.Flags.Speak],
  examples: [
      '6'
    ],
  async execute(client, message, [tracknumber]) {
    const queue = client.player.getQueue(message.guild.id)

    if (!message.member.voice.channel){
        return await message.reply("<:error:888264104081522698> Sorry, you need to join a voice channel first to play a track!");
      } else if (message.guild.members.me.voice.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId){
        return await message.reply("<:error:888264104081522698> You are not in my voice channel!");
      } else if (!client.player.getQueue(message.guild.id)){
        return await message.reply("<:error:888264104081522698> There are no tracks in the queue!");
      };

    if (tracknumber > queue.tracks.length) return await message.reply("<:error:888264104081522698> Invalid track number!")
    if (tracknumber < 1) return await message.reply("<:error:888264104081522698> Invalid track number!")
    
    queue.skipTo(tracknumber - 1).then(async () => {
        return await message.reply(`<:Success:888264105851490355> **Successfully** skipped to the track number \`${tracknumber}\`!`)
  }).catch(() => message.channel.send(`\`❌ [Queue_ERR]:\` Unable to play or add the current track, please try again later!`));
}
}