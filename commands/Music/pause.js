/**
 * @type {import("../../util/types/baseCommand")}
 */
module.exports = {
  name: "pause",
  aliases: [],
  dmOnly: false, //or false
  guildOnly: true, //or false
  args: false, //or false
  usage: '',
  group: 'Music',
  description: 'Pause the current playing track',
  cooldown: 3, //seconds(s)
  guarded: false, //or false
  permissions: [],
  clientPermissions: ["Connect", "Speak"],
  examples: [
      ''
    ],
  /**
   *
   * @param {import("discord.js").Client} client
   * @param {import("discord.js").Message} message
   * @param {String[]} args
   *
   */
  async execute(client, message, args) {
        const queue = client.player.getQueue(message.guildId)

        if (!message.member.voice.channel){
          return await message.reply("<:error:888264104081522698>  Sorry, you need to join a voice channel first to play a song!");
        } else if (message.guild.members.me.voice.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId){
          return await message.reply("<:error:888264104081522698>  You are not in my voice channel!");
        } else if (!client.player.getQueue(message.guild.id)){
          return await message.reply("<:error:888264104081522698>  There are no songs in the queue!");
        };

          queue.setPaused(true).then(async () => {
            await message.reply({ content: "⏸ Music has been paused! Use \`/resume\` to resume the music!" })
        }).catch(() => message.channel.send(`\`❌ [Queue_ERR]:\` Unable to make this action on the current queue, please try again later!`));
}
}