const discord = require('discord.js');
const { MessageActionRow, MessageButton, EmbedBuilder } = require('discord.js');
const { QueryType } = require("discord-player")
const playdl = require("play-dl");

module.exports = {
  name: "stop",
  aliases: ["Stop", "STOP"],
  dmOnly: false, //or false
  guildOnly: true, //or false
  args: false, //or false
  usage: '',
  group: 'Music',
  description: 'Stops the current track and clears the queue',
  cooldown: 3, //seconds(s)
  guarded: false, //or false
  permissions: [],
  clientpermissions: [discord.PermissionsBitField.Flags.Connect, discord.PermissionsBitField.Flags.Speak],
  examples: [
      ''
    ],
  async execute(client, message, args) {
        const queue = client.player.getQueue(message.guildId)

        if (!message.member.voice.channel){
            return await message.reply("<:error:888264104081522698> Sorry, you need to join a voice channel first to play a song!");
          } else if (message.guild.members.me.voice.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId){
            return await message.reply("<:error:888264104081522698> You are not in my voice channel!");
          } else if (!client.player.getQueue(message.guild.id)){
            return await message.reply("<:error:888264104081522698> There are no songs in the queue!");
          };

        queue.destroy().then(async () => {
          return await message.reply("<:Success:888264105851490355> **Successfully** cleared the queue!")
      }).catch(() => message.channel.send(`\`❌ [Queue_ERR]:\` Unable to play or add the current track, please try again later!`));
}
}