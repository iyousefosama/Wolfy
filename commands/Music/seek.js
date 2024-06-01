const discord = require('discord.js');
const { MessageActionRow, MessageButton, EmbedBuilder } = require('discord.js');
const { QueryType } = require("discord-player")
const playdl = require("play-dl");
const ms = require('ms')

module.exports = {
  name: "seek",
  aliases: ["Seek", "SEEK"],
  dmOnly: false, //or false
  guildOnly: true, //or false
  args: false, //or false
  usage: '<time>',
  group: 'Music',
  description: 'Seek to the given time',
  cooldown: 3, //seconds(s)
  guarded: false, //or false
  permissions: [],
  clientPermissions: [discord.PermissionsBitField.Flags.Connect, discord.PermissionsBitField.Flags.Speak],
  examples: [
      '1m'
    ],
  async execute(client, message, [Tracktime]) {
    const queue = client.player.getQueue(message.guildId)

    if (!message.member.voice.channel){
      return await message.reply("<:error:888264104081522698>  Sorry, you need to join a voice channel first to play a song!");
    } else if (message.guild.members.me.voice.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId){
      return await message.reply("<:error:888264104081522698>  You are not in my voice channel!");
    } else if (!client.player.getQueue(message.guild.id)){
      return await message.reply("<:error:888264104081522698>  There are no songs in the queue!");
    };

      const time = ms(Tracktime);

      if(!time || time <= 0) {
        return await message.reply("<:error:888264104081522698> Please add a valid time to seek the track, i.e 3m");
    }

    await queue.seek(time).then(async () => {
        return await message.reply(`:left_right_arrow: Seeked to ${Tracktime}(\`${time}s\`)!`)
  }).catch(() => message.channel.send(`\`❌ [Queue_ERR]:\` Unable to play or add the current track, please try again later!`));
}
}