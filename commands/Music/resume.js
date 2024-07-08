const discord = require('discord.js');
const { MessageActionRow, MessageButton, EmbedBuilder } = require('discord.js');
const { QueryType } = require("discord-player")

module.exports = {
  name: "resume",
  aliases: ["Resume", "RESUME"],
  dmOnly: false, //or false
  guildOnly: true, //or false
  args: false, //or false
  usage: '',
  group: 'Music',
  description: 'Shows informations about covid in any country',
  cooldown: 3, //seconds(s)
  guarded: false, //or false
  permissions: [],
  clientPermissions: [discord.PermissionsBitField.Flags.Connect, discord.PermissionsBitField.Flags.Speak],
  examples: [
      'Story Nights',
      'https://youtube.com/..'
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

		queue.setPaused(false).then(async () => {
      return await message.reply({ content: "⏯ **Resuming the song!**" })
  }).catch(() => message.channel.send(`\`❌ [Queue_ERR]:\` Unable to play or add the current track, please try again later!`));
}
}